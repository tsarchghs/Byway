import { objectType, extendType, stringArg, booleanArg, intArg, nonNull, floatArg, arg } from 'nexus'

export const Lesson = objectType({
  name: 'Lesson',
  definition(t) {
    t.string('id')
    t.string('moduleId')
    t.string('title')
    t.string('type')
    t.int('duration')
    t.string('content')
    t.string('videoUrl')
    t.string('rubric')
    t.boolean('preview')
    t.field('metadata', { type: 'JSON' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('Module', { type: 'Module' })
  },
})

export const LessonQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('lessons', {
      type: 'Lesson',
      resolve: (_, __, ctx) => ctx.prisma.lesson.findMany(),
    })

    t.field('lesson', {
      type: 'Lesson',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) => ctx.prisma.lesson.findUnique({ where: { id } }),
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
        preview: booleanArg(),
        metadata: arg({ type: 'JSON' }),
      },
      resolve: (_, args, ctx) => ctx.prisma.lesson.create({ data: args }),
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
        preview: booleanArg(),
        metadata: arg({ type: 'JSON' }),
      },
      resolve: (_, { id, ...data }, ctx) =>
        ctx.prisma.lesson.update({ where: { id }, data }),
    })

    t.field('deleteLesson', {
      type: 'Lesson',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) => ctx.prisma.lesson.delete({ where: { id } }),
    })
  },
})
