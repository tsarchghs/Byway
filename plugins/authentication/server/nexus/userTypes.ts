import { extendType } from "nexus"

export const UserExtension = extendType({
  type: "GqlUser", // reuse the one from authTypes.ts
  definition(t) {
    t.string("role") // e.g. "teacher" | "student" | "admin"
    t.field("createdAt", { type: "DateTime" })
  },
})

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "GqlUser",
      args: { id: "String" },
      async resolve(_, { id }, ctx) {
        if (!ctx.prisma) throw new Error("Prisma client missing in context")
        const user = await ctx.prisma.user.findUnique({ where: { id } })
        if (!user) throw new Error(`User ${id} not found`)
        return user
      },
    })

    t.field("me", {
      type: "GqlUser",
      async resolve(_, __, ctx) {
        if (!ctx.userId) throw new Error("Not authenticated")
        return ctx.prisma.user.findUnique({ where: { id: ctx.userId } })
      },
    })
  },
})
