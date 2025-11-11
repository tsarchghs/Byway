// plugins/authentication/server/graphql/resolvers.mjs
import { PrismaClient } from "../db/generated/client/index.js";
const prisma = new PrismaClient();

function userFromCtx(ctx) {
  return ctx && ctx.user ? ctx.user : null;
}

export const authUiResolvers = {
  Query: {
    me: async (_p, _a, ctx) => {
      const u = userFromCtx(ctx);
      if (!u?.id) return null;
      const db = await prisma.user.findUnique({ where: { id: u.id } });
      if (!db) return null;
      return {
        id: db.id,
        email: db.email,
        firstName: db.firstName,
        lastName: db.lastName,
        role: db.role,
        avatarUrl: db.avatarUrl,
        uiPrefsJson: db.uiPrefs ? JSON.stringify(db.uiPrefs) : null,
      };
    },
    uiPrefs: async (_p, _a, ctx) => {
      const u = userFromCtx(ctx);
      if (!u?.id) return "{}";
      const db = await prisma.user.findUnique({ where: { id: u.id } });
      return db?.uiPrefs ? JSON.stringify(db.uiPrefs) : "{}";
    },
  },
  Mutation: {
    setUiPref: async (_p, { key, value }, ctx) => {
      const u = userFromCtx(ctx);
      if (!u?.id) return false;
      const current = await prisma.user.findUnique({ where: { id: u.id }, select: { uiPrefs: true } });
      let prefs = current && current.uiPrefs ? current.uiPrefs : {};
      let parsed;
      try { parsed = JSON.parse(value); } catch { parsed = value; }
      prefs[key] = parsed;
      await prisma.user.update({ where: { id: u.id }, data: { uiPrefs: prefs } });
      return true;
    },
    setUiPrefs: async (_p, { patchJson }, ctx) => {
      const u = userFromCtx(ctx);
      if (!u?.id) return false;
      let patch = {};
      try { patch = JSON.parse(patchJson || "{}"); } catch { patch = {}; }
      const current = await prisma.user.findUnique({ where: { id: u.id }, select: { uiPrefs: true } });
      let prefs = current && current.uiPrefs ? current.uiPrefs : {};
      prefs = { ...prefs, ...patch };
      await prisma.user.update({ where: { id: u.id }, data: { uiPrefs: prefs } });
      return true;
    },
    setMyRole: async (_p, { role }, ctx) => {
      const u = userFromCtx(ctx);
      if (!u?.id) return false;
      await prisma.user.update({ where: { id: u.id }, data: { role } });
      return true;
    },
  },
};
