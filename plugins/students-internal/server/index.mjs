import express from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import jwt from "jsonwebtoken"
import { typeDefs } from "./graphql/typeDefs.js"
import { resolvers } from "./graphql/resolvers.js"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

export async function register(app) {
  const mod = await import("./registerGraphql.mjs"); await mod.registerStudentsGraphQL(app);

  const router = express.Router()
  router.use(cors({ origin: ["http://localhost:3000"], credentials: true }))
  // Apollo handles body parsing
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || ""
      const token = auth.replace("Bearer ", "").trim() || undefined
      let user = null
      if (token) {
        try { user = jwt.verify(token, JWT_SECRET) } catch {}
      }
      return { req, token, user }
    },
  })
  await server.start()
  server.applyMiddleware({ app: router, path: "/graphql", cors: false, bodyParserConfig: false })

  router.get("/health", (_req, res) => res.json({ ok: true, plugin: "students-internal" }))

  // Minimal REST for student-courses lookup used by ecommerce cart guard
  router.get("/api/student-courses", async (req, res) => {
    try {
      const { prisma } = await import("./db/client.js")
      const { studentId, courseId } = req.query
      const where = {}
      if (studentId) where.studentId = String(studentId)
      if (courseId) where.courseId = String(courseId)
      const rows = await prisma.studentCourse.findMany({ where })
      res.json({ success: true, data: rows })
    } catch (e) {
      res.status(500).json({ success: false, error: e?.message || String(e) })
    }
  })

  app.use("/api/students-internal", router)
  console.log("[students-internal] GraphQL at /api/students-internal/graphql")
}
