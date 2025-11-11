import { PrismaClient } from "../db/generated/client/index.js";
const prisma = new PrismaClient();

export default {
  Query: {
    async uiPrefs(_, __, ctx) {
      if (!ctx?.user?.id) return {};
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id } });
      return u?.uiPrefs || {};
    },
    async getUiPref(_, { key }, ctx) {
      if (!ctx?.user?.id) return null;
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id } });
      const obj = (u?.uiPrefs || {}) || {};
      const val = Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : null;
      return typeof val === "string" ? val : (val == null ? null : JSON.stringify(val));
    },
  },
  Mutation: {
    async setUiPref(_, { key, value }, ctx) {
      if (!ctx?.user?.id) throw new Error("unauthorized");
      let parsed;
      try { parsed = JSON.parse(value); } catch { parsed = value; }
      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { uiPrefs: { set: { [key]: parsed } } },
      });
      return true;
    },
    async setUiPrefs(_, { input }, ctx) {
      if (!ctx?.user?.id) throw new Error("unauthorized");
      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { uiPrefs: { set: input || {} } },
      });
      return true;
    },
    async setMyRole(_, { role }, ctx) {
      if (!ctx?.user?.id) throw new Error("unauthorized");
      await prisma.user.update({ where: { id: ctx.user.id }, data: { role } });
      return true;
    },
  },
};