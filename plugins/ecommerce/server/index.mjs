import { z } from 'zod'
import { PrismaClient } from './db/generated/client/index.js';
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


// === Zod route validators (auto-generated) ===
// === Zod route validators (auto-generated, fixed) ===
export const ZOrderCreate = z.object({
  studentId: z.string(),
  status: z.any().optional(),
})

export const ZOrderUpdate = z.object({
  id: z.any().optional(),
  studentId: z.any().optional(),
  status: z.any().optional(),
})


// === Zod route validators (auto-generated, fixed) ===
export const ZOrderItemCreate = z.object({
  orderId: z.string(),
  courseId: z.string(),
  quantity: z.any().optional(),
})

export const ZOrderItemUpdate = z.object({
  id: z.any().optional(),
  orderId: z.any().optional(),
  courseId: z.any().optional(),
  quantity: z.any().optional(),
})

// === Zod route validators (auto-generated, fixed) ===
export const ZPaymentCreate = z.object({
  orderId: z.string(),
  provider: z.any().optional(),
  status: z.any().optional(),
  amount: z.number(),
})

export const ZPaymentUpdate = z.object({
  id: z.any().optional(),
  orderId: z.any().optional(),
  provider: z.any().optional(),
  status: z.any().optional(),
  amount: z.any().optional(),
})
// === Zod route validators (auto-generated, fixed) ===
export const ZStudentMirrorCreate = z.object({
  userId: z.any().optional(),
  displayName: z.any().optional(),
})

export const ZStudentMirrorUpdate = z.object({
  id: z.any().optional(),
  userId: z.any().optional(),
  displayName: z.any().optional(),
})

export async function register(app) {
  const prisma = new PrismaClient()

  const router = express.Router()
  router.use((req,res,next)=>{
    if (req.path.startsWith('/graphql') || req.path.includes('/webhook')) return next();
    return express.json()(req,res,next);
  })

  // CORS before everything else
  router.use(cors({ origin: ['http://localhost:3001'], credentials: true }))

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

  
  // === REST: Orders ===
  router.get('/orders', async (req, res) => {
    try {
      const where = {};
      if (req.query.studentId) where.studentId = String(req.query.studentId);
      if (req.query.status) where.status = String(req.query.status);
      const list = await prisma.order.findMany({ where, include: { items: true, payments: true } });
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/orders/:id', async (req, res) => {
    try {
      const item = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true, payments: true } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/orders', async (req, res) => {
    try {
      const created = await prisma.order.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/orders/:id', async (req, res) => {
    try {
      const updated = await prisma.order.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/orders/:id', async (req, res) => {
    try {
      await prisma.order.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

  // === REST: Payments ===
  router.get('/payments', async (_req, res) => {
    try {
      const list = await prisma.payment.findMany();
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/payments/:id', async (req, res) => {
    try {
      const item = await prisma.payment.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/payments', async (req, res) => {
    try {
      const created = await prisma.payment.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/payments/:id', async (req, res) => {
    try {
      await prisma.payment.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

  // === REST: StudentMirror ===
  router.get('/student-mirrors', async (_req, res) => {
    try {
      const list = await prisma.studentMirror.findMany();
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/student-mirrors/:id', async (req, res) => {
    try {
      const item = await prisma.studentMirror.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/student-mirrors', async (req, res) => {
    try {
      const created = await prisma.studentMirror.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/student-mirrors/:id', async (req, res) => {
    try {
      const updated = await prisma.studentMirror.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/student-mirrors/:id', async (req, res) => {
    try {
      await prisma.studentMirror.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

  // === REST: Carts by student ===
  const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000';
  router.get('/carts/by-student/:studentId', async (req, res) => {
    try {
      const studentId = req.params.studentId;
      let cart = await prisma.order.findFirst({ where: { studentId, status: 'PENDING' }, include: { items: true, payments: true } });
      if (!cart) {
        cart = await prisma.order.create({ data: { studentId, status: 'PENDING' } });
        cart.items = [];
        cart.payments = [];
      }
      res.json({ success: true, data: cart });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/carts/by-student/:studentId/items', async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const { courseId, quantity = 1 } = req.body || {};
      if (!courseId) return res.status(400).json({ success: false, error: 'courseId required' });

      try {
        const r = await fetch(`${API_BASE}/plugins/students-internal/api/student-courses?studentId=${encodeURIComponent(studentId)}&courseId=${encodeURIComponent(courseId)}`);
        const j = await r.json();
        if (j?.data?.length) return res.status(409).json({ success: false, error: 'Already enrolled' });
      } catch {}

      let order = await prisma.order.findFirst({ where: { studentId, status: 'PENDING' } });
      if (!order) {
        order = await prisma.order.create({ data: { studentId, status: 'PENDING' } });
      }
      const existing = await prisma.orderItem.findFirst({ where: { orderId: order.id, courseId } });
      if (existing) {
        const updated = await prisma.orderItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + Number(quantity || 1) } });
        return res.json({ success: true, data: updated });
      }
      const created = await prisma.orderItem.create({ data: { orderId: order.id, courseId, quantity: Number(quantity || 1) } });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/carts/by-student/:studentId/items/:orderItemId', async (req, res) => {
    try {
      await prisma.orderItem.delete({ where: { id: req.params.orderItemId } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

app.use('/api/ecommerce', router)
  console.log('[ecommerce] GraphQL available at /api/ecommerce/graphql')
}
