import express from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import { typeDefs } from "./graphql/typeDefs.js"
import { resolvers } from "./graphql/resolvers.js"

export async function register(app) {
  const mod = await import("./registerGraphql.mjs"); await mod.registerInstitutionsGraphQL(app);

  const router = express.Router()
  router.use(cors({ origin: ["http://localhost:3000"], credentials: true }))

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()
  server.applyMiddleware({ app: router, path: "/graphql", cors: false, bodyParserConfig: false })

  router.get("/health", (_req, res) => res.json({ ok: true, plugin: "institutions" }))
  app.use("/api/institutions", router)
  console.log("[institutions] GraphQL at /api/institutions/graphql")
}
