import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { ApolloServer } from 'apollo-server-express'
import Stripe from 'stripe'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'
import { prisma } from './db/client.js'
import { callGraphQL } from './graphql/callPlugins.js'
import dotenv from 'dotenv'
dotenv.config()
const stripe = new Stripe("sk_test....", { apiVersion: '2024-11-20.acacia' })
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
  // Optional admin token that must be supplied to call the /reconcile endpoint
const RECONCILE_ADMIN_TOKEN = process.env.RECONCILE_ADMIN_TOKEN || ''

export async function register(app) {
  const router = express.Router()

  // CORS before everything else
  router.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

  // --- Webhook must use raw body (no JSON parser!) ---
  router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    let event;
    try {
      const sig = req.headers['stripe-signature'] 
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET)
    } catch (err) {
      console.error('[ecommerce webhook] signature error', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object 
        const orderId = (session.metadata?.orderId ) || ''
        const studentId = (session.metadata?.studentId ) || ''
        const token = session.metadata?.jwt || ''

        if (!orderId) throw new Error('No orderId in session metadata')
        const amountTotal = (session.amount_total || 0) / 100

        // mark order paid + payment record
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          })
          await tx.payment.create({
            data: {
              orderId,
              provider: 'stripe',
              status: 'SUCCEEDED',
              amount: amountTotal,
              payload: session,
            },
          })
        })

        // enroll each course from order using canonical studentId stored on the order
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })
        if (order) {
          const canonicalStudentId = order.studentId
          for (const it of order.items) {
            try {
              const enrollStudent = `mutation ($studentId:String!, $courseId:String!) { enrollStudent(studentId:$studentId, courseId:$courseId){ id } }`

              if (!canonicalStudentId) {
                console.error('[ecommerce webhook] missing canonical studentId on order', orderId)
                continue
              }

              // retry transient failures a few times
              let lastErr = null
              for (let attempt = 0; attempt < 3; attempt++) {
                try {
                  await callGraphQL('/api/students-internal/graphql', enrollStudent, { studentId: canonicalStudentId, courseId: it.courseId })
                  lastErr = null
                  break
                } catch (e) {
                  lastErr = e
                  console.warn(`[ecommerce webhook] enroll attempt ${attempt + 1} failed for course ${it.courseId}:`, (e && e.message) || e)
                  // small backoff
                  await new Promise(r => setTimeout(r, 300 * (attempt + 1)))
                }
              }
              if (lastErr) {
                console.error('[ecommerce webhook] enroll ultimately failed for', it.courseId, lastErr?.message || lastErr)
              }
            } catch (e) {
              console.error('[ecommerce webhook] enroll error', e?.message)
            }
          }
        }
      }

      res.json({ received: true })
    } catch (err) {
      console.error('[ecommerce webhook] handler error', err.message)
      res.status(500).json({ ok: false })
    }
  })

  // GraphQL (no body parser—Apollo handles it)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || ''
      const token = auth.replace('Bearer ', '').trim() || undefined
      let user = null
      if (token) {
        try { user = jwt.verify(token, JWT_SECRET) } catch {}
      }
      return { req, token, user }
    },
  })
  await server.start()
  server.applyMiddleware({ app: router, path: '/graphql', cors: false, bodyParserConfig: false })

  router.get('/health', (_, res) => res.json({ ok: true, plugin: 'ecommerce' }))
  
  // Reconciliation endpoint: try to enroll students for PAID orders that might have missed webhook processing
  router.post('/reconcile', async (req, res) => {
    try {
      // Simple auth: require either a configured RECONCILE_ADMIN_TOKEN and matching header
      const providedToken = (req.headers['x-reconcile-token'] || req.headers.authorization || '').toString().replace('Bearer ', '').trim()
      if (RECONCILE_ADMIN_TOKEN && providedToken !== RECONCILE_ADMIN_TOKEN) {
        console.warn('[ecommerce reconcile] unauthorized attempt')
        return res.status(401).json({ ok: false, error: 'unauthorized' })
      }
      // find recent PAID orders (last 7 days)
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const orders = await prisma.order.findMany({ where: { status: 'PAID', updatedAt: { gte: since } }, include: { items: true } })
      const results = []
      for (const order of orders) {
        const studentId = order.studentId
        for (const it of order.items) {
          try {
            // check enrollment via students-internal
            const qCheck = `query ($studentId:String!, $courseId:String!) { isEnrolled(studentId:$studentId, courseId:$courseId) }`
            const d = await callGraphQL('/api/students-internal/graphql', qCheck, { studentId, courseId: it.courseId })
            if (d?.isEnrolled) {
              results.push({ orderId: order.id, courseId: it.courseId, status: 'already_enrolled' })
              continue
            }

            // attempt enroll (idempotent)
            const enrollStudent = `mutation ($studentId:String!, $courseId:String!) { enrollStudent(studentId:$studentId, courseId:$courseId){ id } }`
            let lastErr = null
            for (let attempt = 0; attempt < 3; attempt++) {
              try {
                await callGraphQL('/api/students-internal/graphql', enrollStudent, { studentId, courseId: it.courseId })
                lastErr = null
                break
              } catch (e) {
                lastErr = e
                console.warn(`[reconcile] enroll attempt ${attempt + 1} failed for order ${order.id} course ${it.courseId}:`, (e && e.message) || e)
                await new Promise(r => setTimeout(r, 200 * (attempt + 1)))
              }
            }
            if (lastErr) {
              results.push({ orderId: order.id, courseId: it.courseId, status: 'failed', error: (lastErr && lastErr.message) || String(lastErr) })
            } else {
              results.push({ orderId: order.id, courseId: it.courseId, status: 'enrolled' })
            }
          } catch (e) {
            results.push({ orderId: order.id, courseId: it.courseId, status: 'error', error: (e && e.message) || String(e) })
          }
        }
      }
      res.json({ ok: true, summary: results })
    } catch (err) {
      console.error('[ecommerce reconcile] error', err?.message || err)
      res.status(500).json({ ok: false, error: (err && err.message) || String(err) })
    }
  })

  app.use('/api/ecommerce', router)
  console.log('[ecommerce] GraphQL available at /api/ecommerce/graphql')
}
