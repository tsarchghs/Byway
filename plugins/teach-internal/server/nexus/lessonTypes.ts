import { objectType, extendType, stringArg, intArg, nonNull, arg } from 'nexus'

export const Lesson = objectType({
  name: 'Lesson',
  definition(t) {
    t.string('id')
    t.string('moduleId')
    t.string('title')
    t.string('type')
    t.nullable.int('duration')
    t.nullable.string('content')
    t.nullable.string('videoUrl')
    t.nullable.string('rubric')
    t.boolean('preview')
    t.nullable.field('metadata', { type: 'JSON' }) // <- lab, quiz, resources, etc.
    t.field('createdAt', { type: 'DateTime' })
  },
})

export const LessonQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('lessonsByModule', {
      type: 'Lesson',
      args: { moduleId: nonNull(stringArg()) },
      resolve: (_, { moduleId }, ctx) =>
        ctx.prisma.lesson.findMany({ where: { moduleId } }),
    })
  },
})

export const LessonMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createLesson', {
      type: 'Lesson',
      args: {
        moduleId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        type: nonNull(stringArg()),
        duration: intArg(),
        content: stringArg(),
        videoUrl: stringArg(),
        rubric: stringArg(),
        metadata: arg({ type: 'JSON' }),
      },
      resolve: (_, args, ctx) => ctx.prisma.lesson.create({ data: args as any }),
    })

    t.field('updateLesson', {
      type: 'Lesson',
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
        type: stringArg(),
        duration: intArg(),
        content: stringArg(),
        videoUrl: stringArg(),
        rubric: stringArg(),
        metadata: arg({ type: 'JSON' }),
      },
      resolve: async (_, { id, ...data }, ctx) =>
        ctx.prisma.lesson.update({
          where: { id },
          data: {
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.type !== undefined ? { type: data.type } : {}),
            ...(data.duration !== undefined ? { duration: data.duration } : {}),
            ...(data.content !== undefined ? { content: data.content } : {}),
            ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
            ...(data.rubric !== undefined ? { rubric: data.rubric } : {}),
            ...(data.metadata !== undefined ? { metadata: data.metadata as any } : {}),
          },
        }),
    })

    t.field('deleteLesson', {
      type: 'Lesson',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) => ctx.prisma.lesson.delete({ where: { id } }),
    })
  },
})

export const LessonReorderMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('reorderLessons', {
      type: 'Boolean',
      args: {
        moduleId: nonNull(stringArg()),
        ids: nonNull(list(nonNull(stringArg()))),
      },
      async resolve(_root, args, ctx) {
        const ids = args.ids
        for (let i = 0; i < ids.length; i++) {
          await ctx.prisma.lesson.update({ where: { id: ids[i] }, data: { position: i } })
        }
        return true
      }
    })
  }
})
