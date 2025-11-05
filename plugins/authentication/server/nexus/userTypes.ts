import { objectType, extendType, nonNull, stringArg } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('email')
    t.string('firstName')
    t.string('lastName')
    t.string('role') // e.g. "teacher" | "student" | "admin"
    t.field('createdAt', { type: 'DateTime' })
  },
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_, { id }, ctx) {
        // Defensive checks
        if (!ctx.prisma) throw new Error('Prisma client not in context')
        const user = await ctx.prisma.user.findUnique({ where: { id } })
        if (!user) throw new Error(`User ${id} not found`)
        return user
      },
    })

    // Optional: support querying the current authenticated user
    t.field('me', {
      type: 'User',
      async resolve(_, __, ctx) {
        if (!ctx.user) throw new Error('Not authenticated')
        return ctx.prisma.user.findUnique({ where: { id: ctx.user.id } })
      },
    })
  },
})
