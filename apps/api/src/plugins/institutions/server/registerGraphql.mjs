import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers.js'
export async function registerInstitutionsGraphQL(app){
  const router = express.Router()
  const server = new ApolloServer({ typeDefs, resolvers, context: ({req})=>({req}) })
  await server.start()
  server.applyMiddleware({ app: router, path: '/graphql', cors:false, bodyParserConfig:false })
  app.use('/api/institutions', router)
  console.log('[institutions] GraphQL at /api/institutions/graphql')
}
