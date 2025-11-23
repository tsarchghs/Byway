export const resolvers = {
  Query: {
    me: (_r, _a, ctx) => {
      const user = ctx?.user || null;
      if (!user) return null;
      const roles = Array.isArray(user.roles) ? user.roles : [];
      return { id: user.id || user.sub || "me", email: user.email || "", displayName: user.displayName || user.name || null, roles };
    },
  },
};

import { prisma } from '../db/client.js'

export const uiPrefsResolvers = {
  Query: {
    async myUiPrefs(_r,_a,ctx){
      if (!ctx.user?.id) return null
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id } })
      return u?.uiPrefsJson || null
    },
  },
  Mutation: {
    async setMyUiPrefs(_r,{json},ctx){
      if (!ctx.user?.id) throw new Error('Unauthorized')
      await prisma.user.update({ where: { id: ctx.user.id }, data: { uiPrefsJson: json } })
      return { ok: true }
    },
  }
}
export default uiPrefsResolvers
