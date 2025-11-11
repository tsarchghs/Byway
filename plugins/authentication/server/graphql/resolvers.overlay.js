// Overlay resolvers for Authentication plugin
import { PrismaClient } from '../db/generated/index.js'
const prisma = new PrismaClient()

const resolversOverlay = {
  Query: {
    async me(_root, _args, ctx) {
      if (!ctx?.user?.id) return null
      return prisma.user.findUnique({ where: { id: ctx.user.id } })
    },
    async uiPrefs(_root, _args, ctx) {
      if (!ctx?.user?.id) return null
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id }, select: { uiPrefs: true } })
      return u?.uiPrefs ?? {}
    }
  },
  Mutation: {
    async setMyRole(_root, { role }, ctx) {
      if (!ctx?.user?.id) throw new Error('unauthorized')
      const updated = await prisma.user.update({ where: { id: ctx.user.id }, data: { role } })
      return updated
    },
    async setUiPref(_root, { key, value }, ctx) {
      if (!ctx?.user?.id) throw new Error('unauthorized')
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id }, select: { uiPrefs: true } })
      const uiPrefs = { ...(u?.uiPrefs || {}) }
      uiPrefs[key] = value
      const updated = await prisma.user.update({ where: { id: ctx.user.id }, data: { uiPrefs } })
      return updated
    },
    async setUiPrefs(_root, { patch }, ctx) {
      if (!ctx?.user?.id) throw new Error('unauthorized')
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id }, select: { uiPrefs: true } })
      const uiPrefs = { ...(u?.uiPrefs || {}), ...(patch || {}) }
      const updated = await prisma.user.update({ where: { id: ctx.user.id }, data: { uiPrefs } })
      return updated
    }
  }
}

export default resolversOverlay
