// plugins/students-internal/server/index.ts
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import { schema } from './graphql/index.js'
import { createContext } from './context.js'

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

  app.use('/api/students-internal', router)

  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    })
  )

  console.log('[students-internal] GraphQL available at /api/students-internal/graphql')
}
