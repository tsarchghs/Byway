// plugins/institutions/server/index.mjs
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'

export async function register(app) {
  // Register sub-GraphQL (optional)
  const mod = await import('./registerGraphql.mjs').catch(() => null)
  if (mod?.registerInstitutionsGraphQL) await mod.registerInstitutionsGraphQL(app)

  const router = express.Router()
  router.use(cors({ origin: ['http://localhost:3001'], credentials: true }))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      // Ensure Prisma available in context
      const prisma = await (await import('./graphql/resolvers.js')).getPrisma?.()
      return { prisma }
    },
  })

  await server.start()
  server.applyMiddleware({
    app: router,
    path: '/graphql',
    cors: false,
    bodyParserConfig: false,
  })

  router.get('/health', (_req, res) => res.json({ ok: true, plugin: 'institutions' }))
  app.use('/api/institutions', router)
  console.log('[institutions] GraphQL available at /api/institutions/graphql')
}
