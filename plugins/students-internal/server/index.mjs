import { z } from 'zod'
import { PrismaClient } from '/mnt/data/Byway/Byway/plugins/students-internal/server/db/generated/client/index.js';
// plugins/students-internal/server/index.ts
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import { schema } from './graphql/index.js'
import { createContext } from './context.js'
import { prisma } from './db/client.js'


// === Zod route validators (auto-generated) ===

export const ZStudentCreate = z.object({{'userId: z.string(), displayName: z.any().optional()'}})
export const ZStudentUpdate = z.object({{'id: z.any().optional(), userId: z.any().optional(), displayName: z.any().optional()'}})


export const ZStudentCourseCreate = z.object({{'studentId: z.string(), courseId: z.string()'}})
export const ZStudentCourseUpdate = z.object({{'id: z.any().optional(), studentId: z.any().optional(), courseId: z.any().optional()'}})

export async function register(app) {
  const prisma = new PrismaClient()

  const router = express.Router()

  const server = new ApolloServer({
    schema,
    context: createContext,
  })

  await server.start()

  server.applyMiddleware({
    app: router,
    path: '/graphql',
    cors: false,
    bodyParserConfig: false,
  })

  router.get('/health', (_, res) =>
    res.json({ ok: true, plugin: 'students-internal' })
  )

  // REST: create a student (enroll)
  // POST /api/students-internal/students
  router.post(
    '/students',
    express.json(),
    async (req, res) => {
      try {
        const { userId, displayName } = req.body || {}

        if (!userId) {
          return res.status(400).json({ error: 'userId is required' })
        }

        const created = await prisma.student.create({
          data: {
            userId: String(userId),
            displayName: displayName ? String(displayName) : null,
          },
        })

        return res.status(201).json(created)
      } catch (err) {
        console.error('[students-internal] failed to create student', err)
        return res.status(500).json({ error: 'internal_error' })
      }
    }
  )

  
  // === REST: Students ===
  router.get('/students', async (req, res) => {
    try {
      const where: any = {};
      if (req.query.userId) where.userId = String(req.query.userId);
      const list = await prisma.student.findMany({ where });
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/students/:id', async (req, res) => {
    try {
      const item = await prisma.student.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/students/by-user/:userId', async (req, res) => {
    try {
      const item = await prisma.student.findFirst({ where: { userId: req.params.userId } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/students', async (req, res) => {
    try {
      const data = req.body || {};
      const created = await prisma.student.create({ data });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/students/:id', async (req, res) => {
    try {
      const updated = await prisma.student.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/students/:id', async (req, res) => {
    try {
      await prisma.student.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

  // === REST: StudentCourses ===
  router.get('/student-courses', async (req, res) => {
    try {
      const where: any = {};
      if (req.query.studentId) where.studentId = String(req.query.studentId);
      if (req.query.courseId) where.courseId = String(req.query.courseId);
      const list = await prisma.studentCourse.findMany({ where });
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/student-courses', async (req, res) => {
    try {
      const data = req.body || {};
      const exists = await prisma.studentCourse.findFirst({ where: { studentId: data.studentId, courseId: data.courseId } });
      if (exists) return res.status(200).json({ success: true, data: exists });
      const created = await prisma.studentCourse.create({ data });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/student-courses/:id', async (req, res) => {
    try {
      await prisma.studentCourse.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

app.use('/api/students-internal', router)

  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  )

  console.log('[students-internal] GraphQL available at /api/students-internal/graphql')
}
