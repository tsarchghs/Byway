// plugins/courses-details/server/index.ts
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import cors from 'cors'
import { typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers/course.js'

export async function register(app) {
  const router = express.Router()
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  })

  await server.start()
  server.applyMiddleware({
    app: router,
    path: '/graphql',
    cors: false,
    bodyParserConfig: false,
  })

  router.get('/health', (_, res) => res.json({ ok: true, plugin: 'courses-details' }))
  app.use('/api/courses-details', router)

  app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))
  console.log('[courses-details] GraphQL available at /api/courses-details/graphql')
}
