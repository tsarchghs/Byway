import { sdk } from '../../../apps/api/src/sdk/index.js'
import { z } from 'zod'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { schema } from './nexus/index.js'
import { PrismaClient } from './db/generated/client/index.js'
import { resolveUser, canUser, resolveInstitutionRole } from './permissions.mjs'
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
  router.use(async (req, _res, next) => { try { req.user = await resolveUser(req) } catch {} next() })
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
      const institutionCtxResp = await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(req.params.id)}/institution-context`).catch(() => null)
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.view', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      if (institutionId && req.user?.id) {
        const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
        const authHeader = req.headers.authorization || ''
        const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
          method: 'POST', headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
          body: JSON.stringify({ query: `query($institutionId:String){ classrooms(institutionId:$institutionId){ id enrollments{ studentId status } } }`, variables: { institutionId } })
        }).catch(() => null)
        const json = resp && (await resp.json().catch(() => null))
        const arr = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
        const room = instCtx?.classroomId ? arr.find((r) => r.id === instCtx.classroomId) : null
        const role = await resolveInstitutionRole(req.user.id, institutionId, req)
        if (role === 'student') {
          const enrolled = room ? (Array.isArray(room.enrollments) ? room.enrollments.some((en) => en.studentId === req.user.id && String(en.status || '').toUpperCase() !== 'REMOVED') : false) : false
          if (!enrolled) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not enrolled in classroom' } })
        }
      }
      const item = await sdk.courses.get(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/courses', async (req, res) => {
    try {
      const institutionCtxResp = await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(req.body?.id || req.body?.courseId || '')}/institution-context`).catch(() => null)
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const created = await prisma.course.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { console.log(e); res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/courses/:id', async (req, res) => {
    try {
      const institutionCtxResp = await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(req.params.id)}/institution-context`).catch(() => null)
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const updated = await prisma.course.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/courses/:id', async (req, res) => {
    try {
      const institutionCtxResp = await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(req.params.id)}/institution-context`).catch(() => null)
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
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
      const mod = await prisma.module.findUnique({ where: { id: req.params.id } })
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.view', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      if (institutionId && req.user?.id) {
        const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
        const authHeader = req.headers.authorization || ''
        const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
          method: 'POST', headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
          body: JSON.stringify({ query: `query($institutionId:String){ classrooms(institutionId:$institutionId){ id enrollments{ studentId status } } }`, variables: { institutionId } })
        }).catch(() => null)
        const json = resp && (await resp.json().catch(() => null))
        const arr = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
        const room = instCtx?.classroomId ? arr.find((r) => r.id === instCtx.classroomId) : null
        const role = await resolveInstitutionRole(req.user.id, institutionId, req)
        if (role === 'student') {
          const enrolled = room ? (Array.isArray(room.enrollments) ? room.enrollments.some((en) => en.studentId === req.user.id && String(en.status || '').toUpperCase() !== 'REMOVED') : false) : false
          if (!enrolled) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not enrolled in classroom' } })
        }
      }
      const item = await prisma.module.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/modules', async (req, res) => {
    try {
      const institutionCtxResp = await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(req.body?.courseId || '')}/institution-context`).catch(() => null)
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const created = await prisma.module.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/modules/:id', async (req, res) => {
    try {
      const mod = await prisma.module.findUnique({ where: { id: req.params.id } })
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const updated = await prisma.module.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/modules/:id', async (req, res) => {
    try {
      const mod = await prisma.module.findUnique({ where: { id: req.params.id } })
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
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
      const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } })
      const mod = lesson?.moduleId ? await prisma.module.findUnique({ where: { id: lesson.moduleId } }) : null
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.view', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      if (institutionId && req.user?.id) {
        const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
        const authHeader = req.headers.authorization || ''
        const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
          method: 'POST', headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
          body: JSON.stringify({ query: `query($institutionId:String){ classrooms(institutionId:$institutionId){ id enrollments{ studentId status } } }`, variables: { institutionId } })
        }).catch(() => null)
        const json = resp && (await resp.json().catch(() => null))
        const arr = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
        const room = instCtx?.classroomId ? arr.find((r) => r.id === instCtx.classroomId) : null
        const role = await resolveInstitutionRole(req.user.id, institutionId, req)
        if (role === 'student') {
          const enrolled = room ? (Array.isArray(room.enrollments) ? room.enrollments.some((en) => en.studentId === req.user.id && String(en.status || '').toUpperCase() !== 'REMOVED') : false) : false
          if (!enrolled) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not enrolled in classroom' } })
        }
      }
      const item = await prisma.lesson.findUnique({ where: { id: req.params.id } });
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/lessons', async (req, res) => {
    try {
      const modId = req.body?.moduleId
      const mod = modId ? await prisma.module.findUnique({ where: { id: modId } }) : null
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const created = await prisma.lesson.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/lessons/:id', async (req, res) => {
    try {
      const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } })
      const mod = lesson?.moduleId ? await prisma.module.findUnique({ where: { id: lesson.moduleId } }) : null
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const updated = await prisma.lesson.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/lessons/:id', async (req, res) => {
    try {
      const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } })
      const mod = lesson?.moduleId ? await prisma.module.findUnique({ where: { id: lesson.moduleId } }) : null
      const institutionCtxResp = mod?.courseId ? await fetch(`${req.protocol}://${req.get('host')}/api/teach-internal/course/${encodeURIComponent(mod.courseId)}/institution-context`).catch(() => null) : null
      const instCtx = institutionCtxResp && (await institutionCtxResp.json().catch(() => null))
      const institutionId = instCtx?.institutionId || null
      const allowed = await canUser('course.edit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      await prisma.lesson.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  
  // === REST: Assignments & Submissions ===
  router.get('/assignments/:id', async (req, res) => {
    try {
      const asg = await prisma.assignment.findUnique({ where: { id: req.params.id } })
      if (!asg) return res.status(404).json({ success: false, error: 'Not found' })
      const classroom = await prisma.classroom.findUnique({ where: { id: asg.classroomId } })
      const institutionId = classroom?.institutionId || null
      const allowed = await canUser('assignment.view', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      res.json({ success: true, data: asg })
    } catch (e) { res.status(500).json({ success: false, error: e.message }) }
  })

  router.post('/assignments/:id/submit', async (req, res) => {
    try {
      const asg = await prisma.assignment.findUnique({ where: { id: req.params.id } })
      if (!asg) return res.status(404).json({ success: false, error: 'Not found' })
      const classroom = await prisma.classroom.findUnique({ where: { id: asg.classroomId } })
      const institutionId = classroom?.institutionId || null
      const allowed = await canUser('assignment.submit', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
      const authHeader = req.headers.authorization || ''
      const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
        method: 'POST', headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
        body: JSON.stringify({ query: `query($institutionId:String){ classrooms(institutionId:$institutionId){ id enrollments{ studentId status } teacherId } }`, variables: { institutionId } })
      }).catch(() => null)
      const json = resp && (await resp.json().catch(() => null))
      const rooms = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
      const room = rooms.find((r) => r.id === classroom?.id) || null
      const enrolled = room ? (Array.isArray(room.enrollments) ? room.enrollments.some((en) => en.studentId === req.user?.id && String(en.status || '').toUpperCase() !== 'REMOVED') : false) : false
      if (!enrolled) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not enrolled in classroom' } })
      const fileUrl = req.body?.fileUrl || null
      const comment = req.body?.comment || null
      const now = Date.now()
      const due = new Date(asg.dueDate).getTime()
      const acceptUntil = asg.acceptUntil ? new Date(asg.acceptUntil).getTime() : due
      if (Number.isFinite(acceptUntil) && now > acceptUntil) return res.status(400).json({ success: false, error: 'Assignment closed' })
      const existing = await prisma.submission.findMany({ where: { assignmentId: req.params.id, studentId: req.user?.id }, orderBy: { createdAt: 'desc' } })
      const attempt = (existing[0]?.attempt || 0) + 1
      if (typeof asg.maxAttempts === 'number' && asg.maxAttempts > 0 && attempt > asg.maxAttempts) return res.status(400).json({ success: false, error: 'No attempts left' })
      const created = await prisma.submission.create({ data: { assignmentId: req.params.id, studentId: req.user.id, fileUrl, comment, attempt, isLate: Number.isFinite(due) ? now > due : false } })
      res.status(201).json({ success: true, data: created })
    } catch (e) { res.status(400).json({ success: false, error: e.message }) }
  })

  router.post('/assignments/:id/grade', async (req, res) => {
    try {
      const asg = await prisma.assignment.findUnique({ where: { id: req.params.id } })
      if (!asg) return res.status(404).json({ success: false, error: 'Not found' })
      const classroom = await prisma.classroom.findUnique({ where: { id: asg.classroomId } })
      const institutionId = classroom?.institutionId || null
      const allowed = await canUser('assignment.grade', { user: req.user, institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      let role = null
      if (req.user?.id && institutionId) role = await resolveInstitutionRole(req.user.id, institutionId, req)
      if (role === 'teacher' && classroom?.teacherId && classroom.teacherId !== req.user?.id) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not classroom teacher' } })
      const submissionId = req.body?.submissionId || null
      const grade = typeof req.body?.grade === 'number' ? req.body.grade : null
      const feedback = req.body?.feedback || null
      if (!submissionId || grade === null) return res.status(400).json({ success: false, error: 'submissionId and grade required' })
      const existing = await prisma.submission.findUnique({ where: { id: submissionId } })
      if (!existing || existing.assignmentId !== req.params.id) return res.status(404).json({ success: false, error: 'Submission not found' })
      const updated = await prisma.submission.update({ where: { id: submissionId }, data: { grade, feedback, gradedAt: new Date().toISOString(), graderId: req.user?.id || null } })
      res.json({ success: true, data: updated })
    } catch (e) { res.status(400).json({ success: false, error: e.message }) }
  })

  router.get('/course/:id/institution-context', async (req, res) => {
    try {
      const courseId = String(req.params.id || '').trim()
      const authHeader = req.headers.authorization || ''
      const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
      if (!courseId) return res.status(400).json({ error: 'Missing course id' })
      
      const query = `query { classrooms(institutionId: "") { id institutionId teacherId title code startsAt endsAt courseIds } }`
      const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
        body: JSON.stringify({ query, variables: {} })
      }).catch(() => null)
      const json = resp && (await resp.json().catch(() => null))
      const rooms = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
      const matched = rooms.find((r) => {
        const raw = r.courseIds
        if (!raw) return false
        try {
          const parsed = JSON.parse(raw)
          return parsed?.courseId === courseId || (Array.isArray(parsed) && parsed.includes(courseId))
        } catch {
          return raw === courseId
        }
      }) || null
      if (!matched) return res.json({ classroomId: null })
      
      const instResp = await fetch(`${baseUrl}/api/institutions/graphql`, {
        method: 'POST', headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
        body: JSON.stringify({ query: `query($id:String!){ institution(id:$id){ id name slug } }`, variables: { id: matched.institutionId } })
      }).catch(() => null)
      const instJson = instResp && (await instResp.json().catch(() => null))
      const institution = instJson?.data?.institution || null
      const schedule = { startsAt: matched.startsAt || null, endsAt: matched.endsAt || null }
      const teacherIds = matched.teacherId ? [matched.teacherId] : []
      return res.json({ classroomId: matched.id, institutionId: institution?.id || matched.institutionId, institution, teacherIds, schedule })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to resolve institution context', details: e?.message || null })
    }
  })

  app.use('/api/teach-internal', router)

app.use(cors({
  origin: ['http://localhost:3000'], // your frontend(s)
  credentials: true, // allow cookies / auth headers
}))
  console.log('[teach-internal] GraphQL available at /api/teach-internal/graphql')
}
