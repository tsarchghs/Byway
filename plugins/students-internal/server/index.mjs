// plugins/students-internal/server/index.ts
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import { schema } from './graphql/index.js'
import { createContext } from './context.js'
import { prisma } from './db/client.js'

export async function register(app) {
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

  app.use('/api/students-internal', router)

  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  )

  console.log('[students-internal] GraphQL available at /api/students-internal/graphql')
}
