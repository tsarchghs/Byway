import { sdk } from '../../../apps/api/src/sdk/index.js'
import { z } from 'zod'
// --- imports and prisma setup ---
import express from "express"
import { ApolloServer } from "apollo-server-express"
import {
  makeSchema,
  objectType,
  mutationType,
  stringArg,
  nonNull,
} from "nexus"
import { PrismaClient } from "./db/generated/client/index.js"
import fetch from "node-fetch"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const prisma = new PrismaClient()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ===============================
// 💡 Fetch current authenticated user
// ===============================
async function fetchCurrentUser(token) {
  try {
    const query = `query { me { id email firstName lastName teacherProfileId } }`
    const res = await fetch("http://localhost:4000/api/authentication/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    })
    const text = await res.text()
    const json = JSON.parse(text)
    return json.data?.me || null
  } catch (e) {
    console.warn("[teach] Failed to fetch current user:", e.message)
    return null
  }
}

// ===============================
// 💡 Update user.teacherProfileId in authentication service
// ===============================
async function linkTeacherProfileToUser(token, teacherProfileId) {
  try {
    const mutation = `
      mutation($teacherProfileId: String!) {
        updateUserTeacherProfile(teacherProfileId: $teacherProfileId) {
          id
          teacherProfileId
        }
      }
    `
    const res = await fetch("http://localhost:4000/api/authentication/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { teacherProfileId },
      }),
    })

    const text = await res.text()
    const json = JSON.parse(text)
    if (json.errors) console.warn("[teach] Failed to link teacher profile:", json.errors)
    return json.data?.updateUserTeacherProfile || null
  } catch (e) {
    console.warn("[teach] Failed to update teacherProfileId:", e.message)
    return null
  }
}

// ===============================
// 🧠 Schema (Nexus)
// ===============================
const TeacherProfile = objectType({
  name: "TeacherProfile",
  definition(t) {
    t.string("id")
    t.string("bio")
    t.string("subjects")
    t.string("avatarUrl")
    t.string("payoutEmail")
    t.boolean("verified")
    t.string("createdAt")
  },
})

// Query to fetch teacher profile by id (used by other plugins to verify teacher status)
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('teacherProfile', {
      type: 'TeacherProfile',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        return await sdk.users.getTeacher(id)
      },
    })
  },
})


// ===============================
// 🔧 Mutations
// ===============================
const Mutation = mutationType({
  definition(t) {
    t.field("createTeacherProfile", {
      type: "TeacherProfile",
      args: {
        bio: nonNull(stringArg()),
        subjects: stringArg(),
        avatarUrl: stringArg(),
        payoutEmail: stringArg(),
      },
      async resolve(_, args, ctx) {
        const token = ctx.req.headers.authorization?.replace("Bearer ", "").trim()
        if (!token) throw new Error("Not authenticated")

        // ✅ 1. Verify the current user from the authentication plugin
        const user = await fetchCurrentUser(token)
        if (!user) throw new Error("Could not verify user from authentication service")

        // ✅ 2. Create the teacher profile locally
        const teacherProfile = await ctx.prisma.teacherProfile.create({
          data: {
            bio: args.bio,
            subjects: args.subjects || "",
            avatarUrl: args.avatarUrl,
            payoutEmail: args.payoutEmail,
          },
        })

        // ✅ 3. Link the created profile to the user in the auth plugin
        await linkTeacherProfileToUser(token, teacherProfile.id)

        return teacherProfile
      },
    })
  },
})

// ===============================
// 🚀 Apollo registration
// ===============================

// === Zod route validators (auto-generated) ===

// === Zod route validators (auto-generated, fixed) ===
export const ZTeacherProfileCreate = z.object({
  userId: z.string(),
  displayName: z.any().optional(),
  bio: z.any().optional(),
})

export const ZTeacherProfileUpdate = z.object({
  id: z.any().optional(),
  userId: z.any().optional(),
  displayName: z.any().optional(),
  bio: z.any().optional(),
})

export async function register(app) {
  const router = express.Router()

  const schema = makeSchema({
    types: [TeacherProfile, Query, Mutation],
    outputs: {
      schema: path.join(__dirname, "./schema.graphql"),
      typegen: path.join(__dirname, "./nexus-typegen.d.ts"),
    },
  })

  const apollo = new ApolloServer({
    schema,
    context: ({ req }) => ({ req, prisma }),
    introspection: true,
  })

  await apollo.start()
  router.use("/graphql", express.json())

  apollo.applyMiddleware({
    app: router,
    path: "/graphql",
    bodyParserConfig: false,
  })

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  )

  app.use("/api/teach", router)

  console.log("[teach] GraphQL available at /api/teach/graphql")
}


  // === REST: Teachers ===
  router.get('/teachers', async (_req, res) => {
    try {
      const list = await prisma.teacherProfile.findMany();
      res.json({ success: true, data: list });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.get('/teachers/:id', async (req, res) => {
    try {
      const item = await await sdk.users.getTeacher(args.id);
      if (!item) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/teachers', async (req, res) => {
    try {
      const created = await prisma.teacherProfile.create({ data: req.body || {} });
      res.status(201).json({ success: true, data: created });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/teachers/:id', async (req, res) => {
    try {
      const updated = await prisma.teacherProfile.update({ where: { id: req.params.id }, data: req.body || {} });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/teachers/:id', async (req, res) => {
    try {
      await prisma.teacherProfile.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

