import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function register(app) {
  const router = express.Router();
  router.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

  const server = new ApolloServer({
    typeDefs: [typeDefs],
    resolvers: [resolvers],
    context: ({ req }) => {
      const auth = req.headers.authorization || '';
      const token = auth.replace('Bearer ', '').trim() || undefined;
      let user = null;
      if (token) {
        try { user = jwt.verify(token, JWT_SECRET); } catch {}
      }
      return { req, token, user };
    },
  });

  await server.start();
  server.applyMiddleware({ app: router, path: '/graphql', cors: false, bodyParserConfig: false });

  router.get('/health', (_, res) => res.json({ ok: true, plugin: 'students-internal' }));

  app.use('/api/students-internal', router);
  console.log('[students-internal] GraphQL available at /api/students-internal/graphql');
}
