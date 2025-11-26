import { mutationField, nonNull, stringArg } from "nexus"
import { prisma } from "../../db/client.js"

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
