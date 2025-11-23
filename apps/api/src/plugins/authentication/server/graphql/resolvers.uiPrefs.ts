import { PrismaClient } from '../db/generated/index'
const prisma = new PrismaClient()
export const uiPrefsResolvers = {
  JSON: (v:any)=>v,
  Query: {
    me: async (_:any, __:any, ctx:any) => {
      const id = ctx?.user?.id || null
      if (!id) return { id: 'guest', email: null, role: 'GUEST', uiPrefs: {} }
      const user:any = await prisma.user.findUnique({ where: { id } })
      return { id: user?.id, email: user?.email, role: (user?.teacherProfileId ? 'TEACHER':'STUDENT'), uiPrefs: (user?.uiPrefs ?? {}) }
    },
  },
  Mutation: {
    setUiPref: async (_:any, { key, value }:any, ctx:any) => {
      const id = ctx?.user?.id; if (!id) throw new Error('unauthorized')
      const user:any = await prisma.user.findUnique({ where: { id } })
      const next = { ...(user?.uiPrefs||{}), [key]: value }
      await prisma.user.update({ where: { id }, data: { uiPrefs: next as any } })
      return true
    },
    setUiPrefs: async (_:any, { prefs }:any, ctx:any) => {
      const id = ctx?.user?.id; if (!id) throw new Error('unauthorized')
      await prisma.user.update({ where: { id }, data: { uiPrefs: prefs as any } })
      return true
    },
  },
}
