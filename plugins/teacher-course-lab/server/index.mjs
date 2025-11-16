import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { restRouter } from './rest/index.mjs'
import { fileURLToPath, pathToFileURL } from 'url'
import jwt from 'jsonwebtoken'

export async function register(app) {
  const base = '/api/teacher-course-lab'
app.use(base, (req, _res, next) => {
  const auth = req.headers.authorization
  if (!auth) return next()

  const token = auth.split(' ')[1]
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, 'dev_secret') // replace with real secret
    req.user = { id: decoded.userId }
  } catch (_) {
    // invalid token, skip
  }

  next()
})
  // Mount REST — ONLY ONCE
  app.use(base, restRouter)

  // --- WINDOWS-SAFE ESM PATH HANDLING ---
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const schemaFsPath = path.join(__dirname, 'graphql', 'schema.graphql')
  const resolversFsPath = path.join(__dirname, 'graphql', 'resolvers.mjs')

  const schemaUrl = pathToFileURL(schemaFsPath).href
  const resolversUrl = pathToFileURL(resolversFsPath).href

  // --- Check if GraphQL deps exist ---
  let canGraphQL = false
  try {
    await import('apollo-server-express')
    canGraphQL = true
  } catch (_) {
    console.warn('[teacher-course-lab] Apollo Server not found; GraphQL disabled.')
  }

  if (canGraphQL) {
    const { ApolloServer } = await import('apollo-server-express')

    const typeDefs = fs.readFileSync(schemaFsPath, 'utf8')
    const resolversModule = await import(resolversUrl)
    const resolvers = resolversModule.default ?? resolversModule.resolvers

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ user: req.user ?? null }),
    })

    await server.start()
    server.applyMiddleware({ app, path: base + '/graphql' })

    console.log('[teacher-course-lab] GraphQL mounted at ' + base + '/graphql')
  }

  // About endpoint
  app.get(base + '/_about', (_req, res) => {
    res.json({
      name: 'teacher-course-lab',
      version: '0.1.0',
      graphql: canGraphQL,
    })
  })

  console.log('[teacher-course-lab] REST mounted at ' + base)
}
