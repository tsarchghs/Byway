import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { schema } from './nexus/index.js'
import { PrismaClient } from './db/generated/client/index.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { ensureCodeServer } from './codeServerManager.js'


const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function register(app) {
  const router = express.Router()

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
  app.use('/api/teach-internal', router)

app.use(cors({
  origin: ['http://localhost:3000'], // your frontend(s)
  credentials: true, // allow cookies / auth headers
}))
  console.log('[teach-internal] GraphQL available at /api/teach-internal/graphql')
}
