import { objectType, extendType, stringArg, nonNull } from 'nexus'

export const Module = objectType({
  name: 'Module',
  definition(t) {
    t.string('id')
    t.string('courseId')
    t.string('title')
    t.list.field('lessons', { type: 'Lesson' })
  },
})

export const ModuleQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('modulesByCourse', {
      type: 'Module',
      args: { courseId: nonNull(stringArg()) },
      resolve: (_, { courseId }, ctx) =>
        ctx.prisma.module.findMany({
          where: { courseId },
          include: { lessons: true },
        }),
    })
  },
})

export const ModuleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createModule', {
      type: 'Module',
      args: { courseId: nonNull(stringArg()), title: nonNull(stringArg()) },
      resolve: (_, { courseId, title }, ctx) =>
        ctx.prisma.module.create({ data: { courseId, title } }),
    })

    t.field('updateModule', {
      type: 'Module',
      args: { id: nonNull(stringArg()), title: stringArg() },
      resolve: (_, { id, title }, ctx) =>
        ctx.prisma.module.update({ where: { id }, data: { title: title ?? undefined } }),
    })

    t.field('deleteModule', {
      type: 'Module',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        // cascade delete lessons (Prisma relation mode handles, but ensure if needed)
        return ctx.prisma.module.delete({ where: { id } })
      },
    })
  },
})
