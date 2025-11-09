import { sdk } from '../../../apps/api/src/sdk/index.js'
import { z } from 'zod'
import { PrismaClient } from '/mnt/data/Byway/Byway/plugins/authentication/server/db/generated/index.js';
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { schema } from "./nexus/authSchema.js"
import { createContext } from "./nexus/context.js"


// === Zod route validators (auto-generated) ===

export const ZUserCreate = z.object({{'email: z.string(), password: z.string(), firstName: z.any().optional(), lastName: z.any().optional(), teacherProfileId: z.any().optional()'}})
export const ZUserUpdate = z.object({{'id: z.any().optional(), email: z.any().optional(), password: z.any().optional(), firstName: z.any().optional(), lastName: z.any().optional(), teacherProfileId: z.any().optional()'}})

export async function register(app) {
  const prisma = new PrismaClient()

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
  
  // === REST: Users ===
  router.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json({ success: true, data: users.map(u => ({ ...u, password: undefined })) });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  });
  router.get('/users/:id', async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!user) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: { ...user, password: undefined } });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
  router.post('/users', async (req, res) => {
    try {
      const data = req.body || {};
      const created = await prisma.user.create({ data });
      res.status(201).json({ success: true, data: { ...created, password: undefined } });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.put('/users/:id', async (req, res) => {
    try {
      const data = req.body || {};
      const updated = await prisma.user.update({ where: { id: req.params.id }, data });
      res.json({ success: true, data: { ...updated, password: undefined } });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });
  router.delete('/users/:id', async (req, res) => {
    try {
      await prisma.user.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  });

app.use('/api/authentication', router)

  console.log('[auth] GraphQL available at /api/authentication/graphql')
}
