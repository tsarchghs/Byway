import { queryField } from "nexus"
import { PrismaClient } from "../../db/generated/index.js"

const prisma = new PrismaClient()

export const MyUiPrefs = queryField("myUiPrefs", {
  type: "String",
  resolve: async (_r, _a, ctx) => {
    if (!ctx.user?.id) return null
    const u = await prisma.user.findUnique({ where: { id: ctx.user.id } })
    return u?.uiPrefsJson || null
  },
})
