// plugins/teach/server/index.mjs

import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs as teachTypeDefs } from './graphql/typeDefs.js'
import { resolvers as teachResolvers, getPrisma } from './graphql/resolvers.js'
import { registerTeachGraphQL } from './registerGraphql.mjs'

export async function register(app) {
  if (registerTeachGraphQL) {
    await registerTeachGraphQL(app)
  }

  const router = express.Router()
  router.use(cors({ origin: ['http://localhost:3001'], credentials: true }))

  const server = new ApolloServer({
    typeDefs: teachTypeDefs,
    resolvers: teachResolvers,
    context: async () => ({ prisma: await getPrisma() }),
  })

  await server.start()
  server.applyMiddleware({
    app: router,
    path: '/graphql',
    cors: false,
    bodyParserConfig: false,
  })

  router.get('/health', (_req, res) => res.json({ ok: true, plugin: 'teach' }))
  app.use('/api/teach', router)
  console.log('[teach] GraphQL available at /api/teach/graphql')
}
