import { objectType, extendType, stringArg, nonNull } from 'nexus'

export const Module = objectType({
  name: 'Module',
  definition(t) {
    t.string('id')
    t.string('courseId')
    t.string('title')
    t.list.field('lessons', {
      type: 'Lesson',
      resolve: (p, _, ctx) => ctx.prisma.lesson.findMany({ where: { moduleId: p.id } }),
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
      async resolve(_, args, ctx) {
        console.log('🟢 createModule resolver called with:', args)
        const module = await ctx.prisma.module.create({ data: args })
        console.log('✅ created module:', module)
        return module
      },
    })
  },
})
