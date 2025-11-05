import express from "express"
import { ApolloServer } from "apollo-server-express"
import { schema } from "./nexus/authSchema.js"
import { createContext } from "./nexus/context.js"

export async function register(app) {
  const router = express.Router()

  const apollo = new ApolloServer({
    schema,
    context: ({ req }) => createContext({ req }),
    introspection: true,
  })

  await apollo.start()

  // 👇 Explicitly parse JSON for GraphQL route
  router.use("/graphql", express.json())

  apollo.applyMiddleware({
    app: router,
    path: "/graphql",
    bodyParserConfig: false, // disable Apollo’s own parser
  })

  router.get("/health", (_, res) =>
    res.json({ ok: true, plugin: "authentication" })
  )

  app.use("/api/authentication", router)

  console.log("[auth] GraphQL available at /api/authentication/graphql")
}
