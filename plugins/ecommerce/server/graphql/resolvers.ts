import Stripe from 'stripe'
import { prisma } from '../db/client.js'
import { callGraphQL } from './callPlugins.js'

const TEACH_API = '/api/teach-internal/graphql'
const STUDENTS_API = '/api/students-internal/graphql'

const stripe = new Stripe("sk_test_l0HJNJGrFjfZvVc7afriu6nU00J8rKAYcI" as string, { apiVersion: '2024-11-20.acacia' })

async function getCourseFromTeach(courseId: string) {
  const query = `
    query ($id: String!) {
      course(id: $id) { id title price discount coverUrl }
    }
  `
  const data = await callGraphQL(TEACH_API, query, { id: courseId })
  if (!data?.course) throw new Error('Course not found')
  return data.course as { id: string; title: string; price: number; discount?: number | null }
}

async function validateCouponViaTeach(courseId: string, code: string) {
  if (!code) return 0
  const query = `
    query ($courseId: String!, $code: String!) {
      validateCoupon(courseId: $courseId, code: $code) { percent }
    }
  `
  const data = await callGraphQL(TEACH_API, query, { courseId, code })
  return (data?.validateCoupon?.percent ?? 0) as number
}

async function enrollStudent(token: string | undefined, studentId: string | undefined, courseId: string) {
  const enrollMe = `mutation ($courseId: String!) { enrollMe(courseId: $courseId){ id } }`
  const enrollStudent = `mutation ($studentId: String!, $courseId: String!) { enrollStudent(studentId: $studentId, courseId: $courseId){ id } }`
  if (token) { await callGraphQL(STUDENTS_API, enrollMe, { courseId }, token); return }
  if (!studentId) throw new Error('Missing studentId (no JWT and no studentId arg)')
  await callGraphQL(STUDENTS_API, enrollStudent, { studentId, courseId })
}

export const resolvers = {
  Query: {
    async myOrders(_: any, args: { studentId?: string }, ctx: any) {
      const sid = ctx.user?.id || args.studentId
      if (!sid) return []
      return prisma.order.findMany({
        where: { studentId: sid },
        orderBy: { createdAt: 'desc' },
        include: { items: true, payments: true },
      })
    },
    async isEnrolled(_: any, args: { courseId: string; studentId?: string }, ctx: any) {
      const q1 = `query ($courseId: String!) { isEnrolledMe(courseId: $courseId) }`
      const q2 = `query ($studentId:String!, $courseId:String!) { isEnrolled(studentId:$studentId, courseId:$courseId) }`
      try {
        if (ctx.token) { const d = await callGraphQL(STUDENTS_API, q1, { courseId: args.courseId }, ctx.token); return !!d?.isEnrolledMe }
        if (!args.studentId) return false
        const d = await callGraphQL(STUDENTS_API, q2, { studentId: args.studentId, courseId: args.courseId })
        return !!d?.isEnrolled
      } catch { return false }
    },
    async verifyCheckout(_: any, args: { sessionId: string }, ctx: any) {
      try {
        if (!args.sessionId) return { ok: false }
        const session = await stripe.checkout.sessions.retrieve(args.sessionId as string)
        const orderId = session?.metadata?.orderId || null
        if (!orderId) return { ok: false }
        const order = await prisma.order.findUnique({ where: { id: orderId } })
        return { ok: !!order && order.status === 'PAID', orderId: order?.id || null, status: order?.status || 'PENDING' }
      } catch (e) {
  console.error('[ecommerce] verifyCheckout error', (e as any)?.message)
        return { ok: false }
      }
    },
    async validateCoupon(_: any, args: { courseId: string; code: string }) {
      const percent = await validateCouponViaTeach(args.courseId, args.code)
      return { percent }
    },
  },

  Mutation: {
    /**
     * Create Stripe Checkout session for a cart.
     * - Creates a PENDING order in DB
     * - Returns session URL for redirect
     * - Enrollment & payment record done in webhook on success
     */
    async createCheckout(
      _: any,
      args: {
        items: { courseId: string; quantity?: number }[]
        coupon?: string | null
        studentId?: string | null
        email?: string | null
        successUrl: string
        cancelUrl: string
      },
      ctx: any
    ) {
console.log('[ecommerce] decoded user:', ctx.user)
console.log('[ecommerce] args.studentId:', args.studentId)

      // Map caller to a canonical students-internal Student.id so Orders reference the Student row
      let orderStudentId: string | undefined = undefined
      if (ctx.token) {
        try {
          // Try to find existing Student by auth userId
          const find = await callGraphQL(STUDENTS_API, `query ($userId: String!) { studentByUserId(userId: $userId) { id } }`, { userId: ctx.user.userId }, ctx.token)
          if (find?.studentByUserId?.id) {
            orderStudentId = find.studentByUserId.id
          } else {
            // Create a Student record via GraphQL mutation so we have a canonical Student.id
            const create = await callGraphQL(STUDENTS_API, `mutation ($userId: String!, $displayName: String) { createStudent(userId:$userId, displayName:$displayName){ id } }`, { userId: ctx.user.userId, displayName: ctx.user?.firstName || null }, ctx.token)
            orderStudentId = create?.createStudent?.id
          }
        } catch (e) {
          console.error('[ecommerce] failed to map auth user to Student:', (e as any)?.message || e)
          throw new Error('Failed to map authenticated user to Student record')
        }
      } else {
        orderStudentId = args.studentId || undefined
      }
      if (!orderStudentId) throw new Error('Not authenticated (missing JWT or studentId)')

      // Build line items from TEACH
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      let subtotal = 0
      const snapshotItems: { courseId: string; title: string; price: number; quantity: number }[] = []

      for (const it of args.items) {
        const q = Math.max(1, it.quantity || 1)
        const course = await getCourseFromTeach(it.courseId)
        // Prevent duplicate purchases: check if student is already enrolled
        try {
          if (ctx.token) {
            const d = await callGraphQL(STUDENTS_API, `query ($courseId: String!) { isEnrolledMe(courseId: $courseId) }`, { courseId: it.courseId }, ctx.token)
            if (d?.isEnrolledMe) throw new Error(`Already enrolled in course: ${course.title}`)
          } else {
            const d = await callGraphQL(STUDENTS_API, `query ($studentId: String!, $courseId: String!) { isEnrolled(studentId: $studentId, courseId: $courseId) }`, { studentId: orderStudentId, courseId: it.courseId })
            if (d?.isEnrolled) throw new Error(`Student already enrolled in course: ${course.title}`)
          }
        } catch (e: any) {
          // bubble up meaningful enrollment errors, but hide call failures as generic errors
          if (e?.message?.startsWith('Already enrolled') || e?.message?.startsWith('Student already enrolled')) throw e
          throw new Error('Failed to validate enrollment status before checkout')
        }
        const price = Number(course.price || 0)
        subtotal += price * q
        snapshotItems.push({ courseId: it.courseId, title: course.title, price, quantity: q })

        lineItems.push({
          quantity: q,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(price * 100),
            product_data: {
              name: course.title,
              metadata: { courseId: it.courseId },
            },
          },
        })
      }

      // Apply coupon via TEACH
      const couponPercent = await validateCouponViaTeach(args.items[0]?.courseId || '', args.coupon || '')
      const discount = Math.round(subtotal * (couponPercent / 100) * 100) / 100
      const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100)

      // Create pending order
      // If caller provided a studentId (no JWT) ensure the Student exists in students-internal
      if (!ctx.token) {
        try {
          const sidCheck = await callGraphQL(STUDENTS_API, `query ($studentId: String!) { studentExists(studentId: $studentId) }`, { studentId: orderStudentId })
          if (!sidCheck?.studentExists) throw new Error('Student not found')
        } catch (e) {
          throw new Error((e as any)?.message || 'Failed to validate student before creating order')
        }
      }
      // Ensure local StudentMirror exists in ecommerce DB so we can enforce an internal FK
      try {
        await prisma.studentMirror.upsert({
          where: { id: orderStudentId },
          update: { displayName: ctx.user?.firstName ?? undefined, userId: ctx.user?.userId ?? undefined },
          create: { id: orderStudentId, displayName: ctx.user?.firstName ?? undefined, userId: ctx.user?.userId ?? undefined },
        })
      } catch (e) {
        console.warn('[ecommerce] failed to upsert StudentMirror:', (e as any)?.message || e)
        // not fatal; order creation can still proceed but will fail if DB FK enforces it
      }

      const order = await prisma.order.create({
        data: {
          studentId: orderStudentId,
          email: args.email || null,
          currency: 'EUR',
          subtotal,
          discount,
          total,
          status: 'PENDING',
          items: {
            create: snapshotItems.map(s => ({
              courseId: s.courseId,
              titleSnapshot: s.title,
              priceSnapshot: s.price,
              quantity: s.quantity,
            })),
          },
        },
        include: { items: true },
      })

      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: args.email || undefined,
        line_items: lineItems,
        discounts: couponPercent > 0 ? [{ coupon: await ensureInMemoryCoupon(stripe, couponPercent) }] : undefined,
        success_url: args.successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: args.cancelUrl,
        metadata: {
          orderId: order.id,
          studentId: orderStudentId,
          jwt: ctx.token || '',
        },
      })

      return { sessionId: session.id, url: session.url!, orderId: order.id }
    },
  },
}

/**
 * Create (or memoize) a Stripe coupon for a given percent off
 * so we can attach it to Checkout discounts.
 */
const couponCache = new Map<number, string>()
async function ensureInMemoryCoupon(stripe: Stripe, percentOff: number) {
  const norm = Math.max(0, Math.min(100, Math.floor(percentOff)))
  if (couponCache.has(norm)) return couponCache.get(norm)!
  const c = await stripe.coupons.create({ percent_off: norm, duration: 'once' })
  couponCache.set(norm, c.id)
  return c.id
}
