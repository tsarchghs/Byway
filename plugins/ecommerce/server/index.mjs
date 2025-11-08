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

        // enroll each course from order
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })
        if (order) {
          for (const it of order.items) {
            try {
              // prefer JWT enrollMe; fallback to admin enroll
              const enrollMe = `mutation ($courseId: String!) { enrollMe(courseId: $courseId){ id } }`
              const enrollStudent = `mutation ($studentId:String!, $courseId:String!) { enrollStudent(studentId:$studentId, courseId:$courseId){ id } }`
              if (token) {
                await callGraphQL('/api/students-internal/graphql', enrollMe, { courseId: it.courseId }, token)
              } else {
                if (!studentId) throw new Error('Missing studentId for webhook enrollment')
                await callGraphQL('/api/students-internal/graphql', enrollStudent, { studentId, courseId: it.courseId })
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

  app.use('/api/ecommerce', router)
  console.log('[ecommerce] GraphQL available at /api/ecommerce/graphql')
}
