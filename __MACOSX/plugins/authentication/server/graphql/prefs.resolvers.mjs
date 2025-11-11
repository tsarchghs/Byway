import { PrismaClient } from '../db/generated/client/index.js'
const prisma = new PrismaClient()

export const prefsResolvers = {
  Query: {
    me: async (_root, _args, ctx) => {
      const userId = ctx?.user?.id || ctx?.user?.sub || null
      if (!userId) return null
      return prisma.user.findUnique({ where: { id: String(userId) } })
    },
  },
  Mutation: {
    setUiPref: async (_root, { key, value }, ctx) => {
      const userId = ctx?.user?.id || ctx?.user?.sub || null
      if (!userId) return false
      const user = await prisma.user.findUnique({ where: { id: String(userId) } })
      const next = { ...(user?.uiPrefs || {}), [key]: value }
      await prisma.user.update({ where: { id: String(userId) }, data: { uiPrefs: next } })
      return true
    },
    setUiPrefs: async (_root, { prefs }, ctx) => {
      const userId = ctx?.user?.id || ctx?.user?.sub || null
      if (!userId) return false
      await prisma.user.update({ where: { id: String(userId) }, data: { uiPrefs: prefs } })
      return true
    },
  },
  User: {
    role: (u) => u.role || 'STUDENT',
    uiPrefs: (u) => u.uiPrefs || {},
  },
}
