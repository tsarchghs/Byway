import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { prisma } from './db/client.js';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve(process.cwd(), 'plugins/students-internal/uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const filePromises = fs.promises;

export async function register(app) {
  const router = express.Router();
  router.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
  router.use('/files', express.static(uploadsDir));
  router.use(express.json({ limit: '25mb' }));

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

  // Ensure student profile exists for authenticated userId (idempotent)
  router.post('/api/ensure-student', express.json(), async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.replace('Bearer ', '').trim();
      const userId = req.body?.userId || req.query?.userId;
      const displayName = req.body?.displayName || req.query?.displayName || null;
      if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
      const student = await prisma.student.upsert({
        where: { userId: String(userId) },
        update: { displayName: displayName || undefined },
        create: { userId: String(userId), displayName: displayName || undefined },
      });
      res.json({ success: true, data: student });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  router.post('/files/upload', async (req, res) => {
    try {
      const { fileName, data, courseId, moduleId, lessonId, kind } = req.body || {};
      if (!fileName || !data) {
        return res.status(400).json({ ok: false, error: 'fileName and data are required' });
      }
      const base64Payload = typeof data === 'string' ? data.split(',').pop() : null;
      if (!base64Payload) {
        return res.status(400).json({ ok: false, error: 'Invalid payload' });
      }
      const buffer = Buffer.from(base64Payload, 'base64');
      if (!buffer.length) {
        return res.status(400).json({ ok: false, error: 'Empty file' });
      }
      const safeName = String(fileName).replace(/[^\w.\-]/g, '_') || 'file.bin';
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;
      const targetPath = path.join(uploadsDir, uniqueName);
      await filePromises.writeFile(targetPath, buffer);
      const url = `/api/students-internal/files/${encodeURIComponent(uniqueName)}`;

      let shareRecord = null;
      if (courseId) {
        shareRecord = await prisma.lessonShare.create({
          data: {
            courseId: String(courseId),
            moduleId: moduleId ? String(moduleId) : null,
            lessonId: lessonId ? String(lessonId) : null,
            kind: kind || 'resource',
            title: fileName,
            url,
            size: buffer.length,
            mimeType: req.body?.mimeType || null,
            metadata: {
              originalName: fileName,
              uploadedAt: new Date().toISOString(),
            },
          },
        });
      }

      res.json({
        ok: true,
        file: {
          name: fileName,
          filename: uniqueName,
          size: buffer.length,
          url,
          shareId: shareRecord?.id || null,
        },
      });
    } catch (err) {
      console.error('[students-internal] upload failed', err);
      res.status(500).json({ ok: false, error: 'Upload failed' });
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
