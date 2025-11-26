import { prisma } from '../db/client.js'

export const prefsResolvers = {
  Query: {
    async me(_parent, _args, ctx) {
      try {
        const id = ctx?.user?.id
        if (!id) return null
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) return null
        return {
          id: user.id,
          email: user.email,
          role: (user).role || null,
          uiPrefs: user.uiPrefs ? JSON.stringify(user.uiPrefs) : "{}"
        }
      } catch (e) {
        return null
      }
    }
  },
  Mutation: {
    async setUiPref(_p, args, ctx) {
      const id = ctx?.user?.id
      if (!id) return false
      const user = await prisma.user.findUnique({ where: { id } })
      const key = String(args.key)
      const value = String(args.value)
      let uiPrefs = (user && (user).uiPrefs) || {}
      try {
        if (typeof uiPrefs === 'string') uiPrefs = JSON.parse(uiPrefs)
      } catch { uiPrefs = {} }
      uiPrefs[key] = value
      await prisma.user.update({ where: { id }, data: { uiPrefs } })
      return true
    },
    async setUiPrefs(_p, args, ctx) {
      const id = ctx?.user?.id
      if (!id) return false
      let prefs = {}
      try { prefs = JSON.parse(String(args.prefs || "{}")) } catch { prefs = {} }
      await prisma.user.update({ where: { id }, data: { uiPrefs: prefs } })
      return true
    }
  }
}
