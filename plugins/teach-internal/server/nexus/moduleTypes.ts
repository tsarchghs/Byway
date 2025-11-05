import { objectType, extendType, stringArg, nonNull } from 'nexus'

export const Module = objectType({
  name: 'Module',
  definition(t) {
    t.string('id')
    t.string('courseId')
    t.string('title')
    t.list.field('lessons', {
      type: 'Lesson',
      async resolve(parent, _, ctx) {
        const lessons = await ctx.prisma.lesson.findMany({
          where: { moduleId: parent.id },
        })
        return lessons || [] // ✅ never null
      },
    })
      t.field('Course', { type: 'Course' })
  },
})

export const ModuleQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('modules', {
      type: 'Module',
      resolve: (_, __, ctx) => ctx.prisma.module.findMany({ include: { lessons: true } }),
    })

    t.field('module', {
      type: 'Module',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) =>
        ctx.prisma.module.findUnique({ where: { id }, include: { lessons: true } }),
    })
  },
})

export const ModuleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createModule', {
      type: 'Module',
      args: {
        courseId: nonNull(stringArg()),
        title: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => ctx.prisma.module.create({ data: args }),
    })

    t.field('updateModule', {
      type: 'Module',
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
      },
      resolve: (_, { id, ...data }, ctx) =>
        ctx.prisma.module.update({ where: { id }, data }),
    })

    t.field('deleteModule', {
      type: 'Module',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) =>
        ctx.prisma.module.delete({ where: { id } }),
    })
  },
})
