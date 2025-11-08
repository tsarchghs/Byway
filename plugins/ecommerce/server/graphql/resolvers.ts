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

      const sid = ctx.user.userId || args.studentId
      if (!sid) throw new Error('Not authenticated (missing JWT or studentId)')

      // Build line items from TEACH
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      let subtotal = 0
      const snapshotItems: { courseId: string; title: string; price: number; quantity: number }[] = []

      for (const it of args.items) {
        const q = Math.max(1, it.quantity || 1)
        const course = await getCourseFromTeach(it.courseId)
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
      const order = await prisma.order.create({
        data: {
          studentId: sid,
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
          studentId: sid,
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
