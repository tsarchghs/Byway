// students-internal/server/registerGraphql.mjs
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers.js'

export async function registerStudentsGraphQL(app) {
  const router = express.Router()
  const server = new ApolloServer({
    typeDefs, resolvers,
    context: ({ req }) => ({ req })
  })
  await server.start()
  server.applyMiddleware({ app: router, path: '/graphql', cors: false, bodyParserConfig: false })
  app.use('/api/students-internal', router)
  console.log('[students-internal] GraphQL at /api/students-internal/graphql')
}
