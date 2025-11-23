import fs from 'node:fs'
import path from 'node:path'
import { gql } from 'apollo-server-express'
import { prefsResolvers } from './prefs.resolvers.mjs'

export function loadPrefsTypeDefs() {
  const sdl = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'prefs.typeDefs.graphql'), 'utf-8')
  return gql`${sdl}`
}

export function mergeResolvers(base, extra) {
  // Shallow merge Query/Mutation maps
  const out = { ...base }
  for (const k of Object.keys(extra)) {
    out[k] = { ...(base[k] || {}), ...(extra[k] || {}) }
  }
  return out
}

export const prefsResolversExport = prefsResolvers