import Stripe from 'stripe'
import { prisma } from '../db/client.js'
import { callGraphQL } from './callPlugins.js'

const TEACH_API = '/api/teach-internal/graphql'
const STUDENTS_API = '/api/students-internal/graphql'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_l0HJNJGrFjfZvVc7afriu6nU00J8rKAYcI", {
  apiVersion: '2024-11-20.acacia',
})

async function getCourseFromTeach(courseId) {
  const query = `
    query ($id: String!) {
      course(id: $id) { id title price discount coverUrl }
    }
  `
  const data = await callGraphQL(TEACH_API, query, { id: courseId })
  if (!data?.course) throw new Error('Course not found')
  return data.course
}

async function validateCouponViaTeach(courseId, code) {
  if (!code) return 0
  const query = `
    query ($courseId: String!, $code: String!) {
      validateCoupon(courseId: $courseId, code: $code) { percent }
    }
  `
  const data = await callGraphQL(TEACH_API, query, { courseId, code })
  return data?.validateCoupon?.percent ?? 0
}

async function ensureStudentMirror(studentId, meta = {}) {
  if (!studentId) throw new Error('studentId required')
  await prisma.studentMirror.upsert({
    where: { id: studentId },
    update: meta,
    create: { id: studentId, ...meta },
  })
}

function payablePrice(course) {
  const price = Number(course.price || 0)
  const discount = Number(course.discount || 0)
  return Math.round(price * (1 - discount / 100) * 100) / 100
}

async function recalcTotals(orderId) {
  const items = await prisma.orderItem.findMany({ where: { orderId } })
  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.priceSnapshot) || 0) * (it.quantity || 1),
    0
  )
  await prisma.order.update({
    where: { id: orderId },
    data: { subtotal, discount: 0, total: subtotal },
  })
}

function normalizeOrder(order) {
  return {
    ...order,
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt ?? null,
    updatedAt: order.updatedAt?.toISOString?.() ?? order.updatedAt ?? null,
    payments: (order.payments || []).map((p) => ({
      ...p,
      createdAt: p.createdAt?.toISOString?.() ?? p.createdAt ?? null,
    })),
  }
}

export const resolvers = {
  Query: {
    async cartByStudent(_, { studentId }) {
      const sid = String(studentId)
      await ensureStudentMirror(sid)
      let cart = await prisma.order.findFirst({
        where: { studentId: sid, status: 'PENDING' },
        include: { items: true, payments: true },
      })
      if (!cart) {
        cart = await prisma.order.create({
          data: { studentId: sid, status: 'PENDING', currency: 'EUR' },
          include: { items: true, payments: true },
        })
      }
      return normalizeOrder(cart)
    },

    async myOrders(_, args, ctx) {
      const sid = ctx.user?.id || args.studentId
      if (!sid) return []
      const list = await prisma.order.findMany({
        where: { studentId: sid },
        orderBy: { createdAt: 'desc' },
        include: { items: true, payments: true },
      })
      return list.map(normalizeOrder)
    },

    async isEnrolled(_, args, ctx) {
      const q1 = `query ($courseId: String!) { isEnrolledMe(courseId: $courseId) }`
      const q2 = `query ($studentId:String!, $courseId:String!) { isEnrolled(studentId:$studentId, courseId:$courseId) }`
      try {
        if (ctx.token) {
          const d = await callGraphQL(STUDENTS_API, q1, { courseId: args.courseId }, ctx.token)
          return !!d?.isEnrolledMe
        }
        if (!args.studentId) return false
        const d = await callGraphQL(STUDENTS_API, q2, { studentId: args.studentId, courseId: args.courseId })
        return !!d?.isEnrolled
      } catch {
        return false
      }
    },

    async verifyCheckout(_, args, ctx) {
      try {
        if (!args.sessionId) return { ok: false }
        const session = await stripe.checkout.sessions.retrieve(args.sessionId)
        const orderId = session?.metadata?.orderId || null
        if (!orderId) return { ok: false }
        const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })

        // Fallback: if Stripe already marked the session paid/complete but webhook hasn't run, finalize now
        const paidFlag = session?.payment_status === 'paid' || session?.status === 'complete'
        if (order && order.status === 'PENDING' && paidFlag) {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({ where: { id: orderId }, data: { status: 'PAID' } })
            await tx.payment.create({
              data: {
                orderId,
                provider: 'stripe',
                status: 'SUCCEEDED',
                amount: Number(session.amount_total || 0) / 100,
                payload: session,
              },
            })
          })

          // Enroll courses immediately (mirrors webhook)
          if (order.items?.length) {
            for (const it of order.items) {
              try {
                const enrollStudent = `mutation ($studentId:String!, $courseId:String!) { enrollStudent(studentId:$studentId, courseId:$courseId){ id } }`
                await callGraphQL(STUDENTS_API, enrollStudent, { studentId: order.studentId, courseId: it.courseId })
              } catch (e) {
                console.warn('[ecommerce] enroll fallback failed', e?.message || e)
              }
            }
          }
        }

        const refreshed = order
          ? await prisma.order.findUnique({ where: { id: orderId } })
          : null

        return {
          ok: !!refreshed && refreshed.status === 'PAID',
          orderId: refreshed?.id || orderId,
          status: refreshed?.status || order?.status || 'PENDING',
        }
      } catch (e) {
        console.error('[ecommerce] verifyCheckout error', e?.message)
        return { ok: false }
      }
    },

    async validateCoupon(_, args) {
      const percent = await validateCouponViaTeach(args.courseId, args.code)
      return { percent }
    },
  },

  Mutation: {
    async addCartItem(_, { studentId, courseId, quantity }) {
      const sid = String(studentId)
      await ensureStudentMirror(sid)
      let cart = await prisma.order.findFirst({ where: { studentId: sid, status: 'PENDING' } })
      if (!cart) {
        cart = await prisma.order.create({ data: { studentId: sid, status: 'PENDING', currency: 'EUR' } })
      }

      const course = await getCourseFromTeach(courseId)
      const priceSnapshot = payablePrice(course)
      const existing = await prisma.orderItem.findFirst({ where: { orderId: cart.id, courseId } })
      const qty = Number(quantity || 1)

      let item
      if (existing) {
        item = await prisma.orderItem.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity + qty,
            titleSnapshot: course.title,
            priceSnapshot,
          },
        })
      } else {
        item = await prisma.orderItem.create({
          data: {
            orderId: cart.id,
            courseId,
            quantity: qty,
            titleSnapshot: course.title,
            priceSnapshot,
          },
        })
      }

      await recalcTotals(cart.id)
      return item
    },

    async removeCartItem(_, { orderItemId }) {
      const item = await prisma.orderItem.findUnique({ where: { id: orderItemId } })
      if (item) {
        await prisma.orderItem.delete({ where: { id: orderItemId } })
        await recalcTotals(item.orderId)
      }
      return { ok: true }
    },

    async clearCart(_, { studentId }) {
      const cart = await prisma.order.findFirst({ where: { studentId, status: 'PENDING' } })
      if (!cart) return { ok: true }
      await prisma.orderItem.deleteMany({ where: { orderId: cart.id } })
      await prisma.order.update({
        where: { id: cart.id },
        data: { subtotal: 0, discount: 0, total: 0 },
      })
      return { ok: true }
    },

    /**
     * Create Stripe Checkout session for a cart.
     * - Creates a PENDING order in DB
     * - Returns session URL for redirect
     * - Enrollment & payment record done in webhook on success
     */
    async createCheckout(_, args, ctx) {
      let orderStudentId
      if (ctx.token) {
        try {
          const find = await callGraphQL(
            STUDENTS_API,
            `query ($userId: String!) { studentByUserId(userId: $userId) { id } }`,
            { userId: ctx.user?.userId },
            ctx.token
          )
          if (find?.studentByUserId?.id) {
            orderStudentId = find.studentByUserId.id
          } else {
            const create = await callGraphQL(
              STUDENTS_API,
              `mutation ($userId: String!, $displayName: String) { createStudent(userId:$userId, displayName:$displayName){ id } }`,
              { userId: ctx.user?.userId, displayName: ctx.user?.firstName || null },
              ctx.token
            )
            orderStudentId = create?.createStudent?.id
          }
        } catch (e) {
          console.error('[ecommerce] failed to map auth user to Student:', e?.message || e)
          throw new Error('Failed to map authenticated user to Student record')
        }
      } else {
        orderStudentId = args.studentId || undefined
      }
      if (!orderStudentId) throw new Error('Not authenticated (missing JWT or studentId)')

      await ensureStudentMirror(orderStudentId, {
        displayName: ctx.user?.firstName ?? undefined,
        userId: ctx.user?.userId ?? undefined,
      })

      const lineItems = []
      let subtotal = 0
      const snapshotItems = []

      for (const it of args.items) {
        const q = Math.max(1, it.quantity || 1)
        const course = await getCourseFromTeach(it.courseId)

        try {
          const d = await callGraphQL(
            STUDENTS_API,
            `query ($studentId: String!, $courseId: String!) { isEnrolled(studentId: $studentId, courseId: $courseId) }`,
            { studentId: orderStudentId, courseId: it.courseId },
            ctx.token
          )
          if (d?.isEnrolled) throw new Error(`Student already enrolled in course: ${course.title}`)
        } catch (e) {
          if (e?.message?.startsWith('Already enrolled') || e?.message?.startsWith('Student already enrolled')) {
            throw e
          }
          throw new Error('Failed to validate enrollment status before checkout')
        }

        const price = payablePrice(course)
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

      const couponPercent = await validateCouponViaTeach(args.items[0]?.courseId || '', args.coupon || '')
      const discount = Math.round(subtotal * (couponPercent / 100) * 100) / 100
      const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100)

      if (!ctx.token) {
        const sidCheck = await callGraphQL(
          STUDENTS_API,
          `query ($studentId: String!) { studentExists(studentId: $studentId) }`,
          { studentId: orderStudentId }
        )
        if (!sidCheck?.studentExists) throw new Error('Student not found')
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
            create: snapshotItems.map((s) => ({
              courseId: s.courseId,
              titleSnapshot: s.title,
              priceSnapshot: s.price,
              quantity: s.quantity,
            })),
          },
        },
        include: { items: true },
      })

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

      return { sessionId: session.id, url: session.url, orderId: order.id }
    },
  },
}

const couponCache = new Map()
async function ensureInMemoryCoupon(stripeClient, percentOff) {
  const norm = Math.max(0, Math.min(100, Math.floor(percentOff)))
  if (couponCache.has(norm)) return couponCache.get(norm)
  const c = await stripeClient.coupons.create({ percent_off: norm, duration: 'once' })
  couponCache.set(norm, c.id)
  return c.id
}
