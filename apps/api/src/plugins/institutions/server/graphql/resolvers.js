// plugins/institutions/server/graphql/resolvers.js
import { PrismaClient } from '../db/generated/index'
import { resolveUser, resolveInstitutionRole, canUser } from '../permissions.mjs'
const prismaSingleton = new PrismaClient()
export async function getPrisma() {
  return 1
}

function isOwnerOrPublic(inst, user) {
  if (!inst) return false
  if (inst.isPublic) return true
  return Boolean(user?.id && inst.createdByUserId === user.id)
}

export const resolvers = {

}

function requireAuth(ctx) {
  if (!ctx?.token) throw new Error('Not authenticated')
}
