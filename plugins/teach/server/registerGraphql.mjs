// plugins/teach/server/registerGraphql.mjs
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'

export async function registerTeachGraphQL(app) {
  const router = express.Router()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const mod = await import('./graphql/resolvers.js')
      const getPrisma = mod.getPrisma
      const prisma = await getPrisma?.()
      return { req, prisma }
    },
  })

  await server.start()
  server.applyMiddleware({
    app: router,
    path: '/graphql',
    cors: false,
    bodyParserConfig: false,
  })

  app.use('/api/teach', router)
  console.log('[teach] GraphQL available at /api/teach/graphql')
}
