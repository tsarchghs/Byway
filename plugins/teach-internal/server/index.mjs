import { sdk } from '../../../apps/api/src/sdk/index.js'
import { z } from 'zod'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { schema } from './nexus/index.js'
import { PrismaClient } from './db/generated/client/index.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { ensureCodeServer } from './codeServerManager.js'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const uploadsDir = path.resolve(process.cwd(), 'plugins/teach-internal/uploads')
fs.mkdirSync(uploadsDir, { recursive: true })
const filePromises = fs.promises


// === Zod route validators (auto-generated) ===
// === Zod route validators (auto-generated, fixed) ===
export const ZCourseCreate = z.object({
  title: z.string(),
  teacherId: z.string(),
  category: z.any().optional(),
  difficulty: z.any().optional(),
})

export const ZCourseUpdate = z.object({
  id: z.any().optional(),
  title: z.any().optional(),
  teacherId: z.any().optional(),
  category: z.any().optional(),
  difficulty: z.any().optional(),
})

export const ZModuleCreate = z.object({
  courseId: z.string(),
  title: z.string(),
  order: z.any().optional(),
})

export const ZModuleUpdate = z.object({
  id: z.any().optional(),
  courseId: z.any().optional(),
  title: z.any().optional(),
  order: z.any().optional(),
})

export const ZLessonCreate = z.object({
  moduleId: z.string(),
  title: z.string(),
  content: z.any().optional(),
  order: z.any().optional(),
})

export const ZLessonUpdate = z.object({
  id: z.any().optional(),
  moduleId: z.any().optional(),
  title: z.any().optional(),
  content: z.any().optional(),
  order: z.any().optional(),
})

export async function register(app) {
  const router = express.Router()
  router.use('/files', express.static(uploadsDir))
  router.use((req, res, next) => {
    if (req.path.startsWith('/graphql') || req.path.includes('/webhook')) return next()
    return express.json({ limit: '25mb' })(req, res, next)
  })

  // ⚠️ DO NOT use express.json() here!
  // Apollo already handles parsing internally

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req.headers.authorization || ''
      const token = auth.replace('Bearer ', '').trim()

      let user = null
      if (token) {
        try {
          user = jwt.verify(token, JWT_SECRET)
        } catch (err) {
          console.warn('[teach-internal] Invalid JWT:', err.message)
        }
      }

      return { req, prisma, token, user }
    },
  })

  await server.start()

  // ✅ Apply Apollo middleware directly to router
  server.applyMiddleware({
    app: router,
    path: '/graphql',
  cors: false,              
    bodyParserConfig: false, // 👈 disables Apollo’s built-in parser conflict
  })

  // ✅ Simple health check
  router.get('/health', (_, res) => res.json({ ok: true, plugin: 'teach-internal' }))

  router.post('/files/upload', async (req, res) => {
    try {
      const { fileName, data } = req.body || {}
      if (!fileName || !data) {
        return res.status(400).json({ ok: false, error: 'fileName and data are required' })
      }
      const base64Payload = typeof data === 'string' ? data.split(',').pop() : null
      if (!base64Payload) {
        return res.status(400).json({ ok: false, error: 'Invalid file payload' })
      }
      const buffer = Buffer.from(base64Payload, 'base64')
      if (!buffer.length) {
        return res.status(400).json({ ok: false, error: 'Empty file payload' })
      }
      const safeName = String(fileName).replace(/[^\w.\-]/g, '_') || 'file.bin'
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`
      const targetPath = path.join(uploadsDir, uniqueName)
      await filePromises.writeFile(targetPath, buffer)
      const url = `/api/teach-internal/files/${encodeURIComponent(uniqueName)}`
      res.json({
        ok: true,
        file: {
          name: fileName,
          filename: uniqueName,
          size: buffer.length,
          url,
        },
      })
    } catch (err) {
      console.error('[teach-internal] upload failed', err)
      res.status(500).json({ ok: false, error: 'Upload failed' })
    }
  })
router.get('/code-server/:teacherId/:lessonId', async (req, res) => {
  try {
    const { teacherId, lessonId } = req.params
    const info = await ensureCodeServer(teacherId, lessonId)
    res.json({ ok: true, ...info })
  } catch (err) {
    console.error('[code-server]', err)
    res.status(500).json({ ok: false, error: err.message })
  }
})
  
  // === REST: Courses ===
  router.get('/courses', async (_req, res) => {
    try {
      const list = await await sdk.courses.list();
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/courses/:id', async (req, res) => {
    try {
      const item = await await sdk.courses.get(args.id);
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/courses', async (req, res) => {
    try {
      const created = await prisma.course.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { console.log(e); res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/courses/:id', async (req, res) => {
    try {
      const updated = await prisma.course.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/courses/:id', async (req, res) => {
    try {
      await prisma.course.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

  // === REST: Modules ===
  router.get('/modules', async (_req, res) => {
    try {
      const list = await prisma.module.findMany();
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/modules/:id', async (req, res) => {
    try {
      const item = await prisma.module.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/modules', async (req, res) => {
    try {
      const created = await prisma.module.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/modules/:id', async (req, res) => {
    try {
      const updated = await prisma.module.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/modules/:id', async (req, res) => {
    try {
      await prisma.module.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

  // === REST: Lessons ===
  router.get('/lessons', async (_req, res) => {
    try {
      const list = await prisma.lesson.findMany();
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/lessons/:id', async (req, res) => {
    try {
      const item = await prisma.lesson.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/lessons', async (req, res) => {
    try {
      const created = await prisma.lesson.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/lessons/:id', async (req, res) => {
    try {
      const updated = await prisma.lesson.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/lessons/:id', async (req, res) => {
    try {
      await prisma.lesson.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

app.use('/api/teach-internal', router)

app.use(cors({
  origin: ['http://localhost:3000'], // your frontend(s)
  credentials: true, // allow cookies / auth headers
}))
  console.log('[teach-internal] GraphQL available at /api/teach-internal/graphql')
}
