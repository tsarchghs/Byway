import { registerTeachGraphQL } from './registerGraphql.mjs'
import express from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import { typeDefs } from "./graphql/typeDefs.js"
import { resolvers } from "./graphql/resolvers.js"

\1
  await registerTeachGraphQL(app)
  const router = express.Router()
  router.use(cors({ origin: ["http://localhost:3000"], credentials: true }))

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()
  server.applyMiddleware({ app: router, path: "/graphql", cors: false, bodyParserConfig: false })

  router.get("/health", (_req, res) => res.json({ ok: true, plugin: "teach" }))
  app.use("/api/teach", router)
  console.log("[teach] GraphQL at /api/teach/graphql")
}
