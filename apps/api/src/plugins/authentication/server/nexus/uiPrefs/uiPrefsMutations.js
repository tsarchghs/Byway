import { mutationField, nonNull, stringArg } from "nexus"
import { PrismaClient } from "../../db/generated/index.js"

const prisma = new PrismaClient()

export const SetMyUiPrefs = mutationField("setMyUiPrefs", {
  type: "UiPrefsResult",
  args: {
    json: nonNull(stringArg()),
  },
  resolve: async (_r, { json }, ctx) => {
    if (!ctx.user?.id) throw new Error("Unauthorized")

    await prisma.user.update({
      where: { id: ctx.user.id },
      data: { uiPrefsJson: json },
    })

    return { ok: true }
  },
})