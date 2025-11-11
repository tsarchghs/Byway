import fs from 'node:fs'
import path from 'node:path'
import { gql } from 'apollo-server-express'
import { uiPrefsResolvers } from './resolvers.uiPrefs.js'

export function mergeUiPrefs(existingTypeDefs: any, existingResolvers: any) {
  let extraSDL = ''
  const here = path.dirname(new URL(import.meta.url).pathname)
  const sdlPath = path.join(here, 'typeDefs.uiPrefs.graphql')
  if (fs.existsSync(sdlPath)) {
    extraSDL = fs.readFileSync(sdlPath, 'utf8')
  }
  const typeDefs = Array.isArray(existingTypeDefs) ? existingTypeDefs.slice() : (existingTypeDefs ? [existingTypeDefs] : [])
  if (extraSDL) typeDefs.push(gql`${extraSDL}`)
  const resolvers = Object.assign({}, existingResolvers || {})
  resolvers.Query = Object.assign({}, (existingResolvers && existingResolvers.Query) || {}, uiPrefsResolvers.Query)
  resolvers.Mutation = Object.assign({}, (existingResolvers && existingResolvers.Mutation) || {}, uiPrefsResolvers.Mutation)
  return { typeDefs, resolvers }
}
