import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { restRouter } from './rest/index.mjs';

export async function register(app) {
  const base = '/api/teacher-course-lab';

  // Mount REST
  app.use(base, restRouter);

  // Optionally mount GraphQL if deps exist
  const schemaPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), './graphql/schema.graphql');
  const resolversPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), './graphql/resolvers.mjs');

  let canGraphQL = false;
  try {
    await import('apollo-server-express');
    canGraphQL = true;
  } catch (e) {
    console.warn('[teacher-course-lab] Apollo Server not found; GraphQL endpoint is disabled.');
  }

  if (canGraphQL) {
    const { ApolloServer } = await import('apollo-server-express');
    const { readFileSync } = await import('node:fs');
    const typeDefs = readFileSync(schemaPath, 'utf8');
    const { resolvers } = await import(resolversPath);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        user: req.user ?? null // host app may attach req.user
      })
    });
    await server.start();
    server.applyMiddleware({ app, path: base + '/graphql' });
    console.log('[teacher-course-lab] GraphQL mounted at ' + base + '/graphql');
  }

  app.get(base + '/_about', (_req, res) => {
    res.json({
      name: 'teacher-course-lab',
      version: '0.1.0',
      graphql: canGraphQL,
    });
  });

  console.log('[teacher-course-lab] REST mounted at ' + base);
}
