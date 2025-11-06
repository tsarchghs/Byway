import express from "express"
import { ApolloServer } from "apollo-server-express"
import { schema } from "./nexus/authSchema.js"
import { createContext } from "./nexus/context.js"

export async function register(app) {
  const router = express.Router()

  // ✅ 1. Start Apollo first
  const apollo = new ApolloServer({
    schema,
    context: ({ req }) => createContext({ req }),
    introspection: true,
  })
  await apollo.start()

  // ✅ 2. Apply the JSON parser for *this* path only
  router.use('/graphql', express.json())

  // ✅ 3. Mount Apollo middleware *on router*, not app
  apollo.applyMiddleware({
    app: router,
    path: '/graphql',
    bodyParserConfig: false,
  })

  // ✅ 4. Health check
  router.get('/health', (_, res) => res.json({ ok: true, plugin: 'authentication' }))

  // ✅ 5. Register router under plugin base path
  app.use('/api/authentication', router)

  console.log('[auth] GraphQL available at /api/authentication/graphql')
}
