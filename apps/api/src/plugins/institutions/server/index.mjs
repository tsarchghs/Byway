// plugins/institutions/server/index.mjs
import express from 'express'
import { resolveUser, canUser } from './permissions.mjs'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'
import jwt from 'jsonwebtoken'
export async function register(app) {
  // Register sub-GraphQL (optional)
  const mod = await import('./registerGraphql.mjs').catch(() => null)
  if (mod?.registerInstitutionsGraphQL) await mod.registerInstitutionsGraphQL(app)

  const router = express.Router()
  router.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Ensure Prisma available in context
      const prisma = await (await import('./graphql/resolvers.js')).getPrisma?.()
      const auth = req?.headers?.authorization || ''
      const token = auth.replace('Bearer ', '').trim()
      let decoded = jwt.decode(token)
      console.log(decoded)
      decoded.id = decoded.userId
      return { prisma, token, user: decoded, req }
    },
  })

  await server.start()
  server.applyMiddleware({
    app: router,
    path: '/graphql',
    cors: false,
    bodyParserConfig: false,
  })

  router.use(async (req, _res, next) => { try { req.user = await resolveUser(req) } catch {} next() })
  router.use('/graphql', async (req, _res, next) => { try { req.user = req.user || await resolveUser(req) } catch {} next() })
  router.use(express.json())

  
  router.get('/classrooms/:id/course-binding', async (req, res) => {
    try {
      const allowed = await canUser('course.view', { user: req.user })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const prisma = await (await import('./graphql/resolvers.js')).getPrisma?.()
      const id = String(req.params.id || '').trim()
      if (!id) return res.status(400).json({ error: 'Missing classroom id' })
      const room = await prisma.classroom.findUnique({ where: { id } })
      if (!room) return res.status(404).json({ error: 'Classroom not found' })
      let binding = null
      if (room.courseIds) {
        try { binding = JSON.parse(room.courseIds) } catch {}
      }
      const payload = {
        classroomId: room.id,
        institutionId: room.institutionId,
        teacherId: room.teacherId || null,
        schedule: { startsAt: room.startsAt || null, endsAt: room.endsAt || null },
        binding: binding && typeof binding === 'object' ? binding : (room.courseIds ? { courseId: room.courseIds } : null),
      }
      return res.json(payload)
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load binding', details: e?.message || null })
    }
  })

  router.post('/classrooms/:id/bind-course', async (req, res) => {
    try {
      const prisma = await (await import('./graphql/resolvers.js')).getPrisma?.()
      const id = String(req.params.id || '').trim()
      const courseId = String(req.body?.courseId || '').trim()
      const preferredModuleIds = Array.isArray(req.body?.preferredModuleIds) ? req.body.preferredModuleIds.map(String) : undefined
      if (!id || !courseId) return res.status(400).json({ error: 'Missing id or courseId' })
      const room = await prisma.classroom.findUnique({ where: { id } })
      const allowed = await canUser('classroom.edit', { user: req.user, institutionId: room?.institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const binding = preferredModuleIds ? { courseId, preferredModuleIds } : { courseId }
      const updated = await prisma.classroom.update({ where: { id }, data: { courseIds: JSON.stringify(binding) } })
      return res.json({ ok: true, classroomId: updated.id, binding })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to bind course', details: e?.message || null })
    }
  })

  router.post('/classrooms/:id/unbind-course', async (req, res) => {
    try {
      const prisma = await (await import('./graphql/resolvers.js')).getPrisma?.()
      const id = String(req.params.id || '').trim()
      if (!id) return res.status(400).json({ error: 'Missing id' })
      const room = await prisma.classroom.findUnique({ where: { id } })
      const allowed = await canUser('classroom.edit', { user: req.user, institutionId: room?.institutionId, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      await prisma.classroom.update({ where: { id }, data: { courseIds: null } })
      return res.json({ ok: true })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to unbind course', details: e?.message || null })
    }
  })

  router.get('/getRole', async (req, res) => {
    try {
      const user = req.user
      const institutionId = String(req.query?.institutionId || '').trim()
      if (!user?.id || !institutionId) return res.status(400).json({ error: 'Missing params' })
      const role = await (await import('./permissions.mjs')).resolveInstitutionRole(user.id, institutionId, req)
      return res.json(role)
    } catch (e) {
      return res.status(500).json({ error: e?.message || 'Failed' })
    }
  })

  router.get('/health', (_req, res) => res.json({ ok: true, plugin: 'institutions' }))
  app.use('/api/institutions', router)
  console.log('[institutions] GraphQL available at /api/institutions/graphql')
}
