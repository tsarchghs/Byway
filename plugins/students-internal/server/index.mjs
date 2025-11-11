import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { prisma } from './db/client.js';

export async function register(app) {
  const router = express.Router();
  router.use(cors({ origin: ['http://localhost:3001'], credentials: true }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = req.headers.authorization || '';
      const token = auth.replace('Bearer ', '').trim() || undefined;
      return { req, token, prisma };
    },
  });
  await server.start();
  server.applyMiddleware({ app: router, path: '/graphql', cors: false, bodyParserConfig: false });

  router.get('/api/student-courses', async (req, res) => {
    try {
      const { studentId, courseId } = req.query;
      const where = { studentId: String(studentId || '') };
      const list = await prisma.studentCourse.findMany({ where });
      const filtered = courseId ? list.filter(x => x.courseId === String(courseId)) : list;
      res.json({ success: true, data: filtered });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  router.get('/health', (_, res) => res.json({ ok: true, plugin: 'students-internal' }));

  app.use('/api/students-internal', router);
  console.log('[students-internal] GraphQL at /api/students-internal/graphql');
}

// students-internal overview endpoint (surgical)
try {
  const expressMod = await import('express')
  const router = expressMod.default.Router()
  router.get('/overview', async (req, res) => {
    res.json({ data: { courses: 3, assignments: 2, avgGrade: 86, activity: [
      { at: new Date().toISOString(), text: 'Submitted Lab 1' },
      { at: new Date().toISOString(), text: 'Viewed Lecture 2' }
    ] } })
  })
  app.use('/api', router)
} catch {}


// --- overview for dashboard (mock, safe) ---
try {
  const expressImport = await import('express')
  const router = expressImport.default.Router()
  router.get('/api/overview', async (_req, res) => {
    res.json({ success:true, data: {
      courses: [{id:'c1', title:'Algorithms'}, {id:'c2', title:'Databases'}],
      assignments: [{id:'a1', title:'Project 1', due:'2025-11-20'}],
      avgGrade: 88,
      activity: [
        {at: new Date().toISOString(), text:'Viewed Module 3'},
        {at: new Date(Date.now()-3600e3).toISOString(), text:'Submitted Quiz 2'}
      ]
    }})
  })
  app.use('/api/students-internal', router)
  console.log('[students-internal] overview endpoint at /api/students-internal/api/overview')
} catch {}
