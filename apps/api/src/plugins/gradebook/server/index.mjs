import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';

export async function register(app) {
  const router = express.Router();

  router.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );
  router.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
    }),
  });

  await server.start();
  server.applyMiddleware({ app: router, path: '/graphql' });

  router.get('/health', (req, res) => {
    res.json({
      ok: true,
      plugin: 'gradebook',
      message: 'Gradebook service is up',
    });
  });

  app.use('/api/gradebook', router);
}
