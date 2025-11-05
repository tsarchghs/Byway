import { objectType, extendType, stringArg, intArg, nonNull } from 'nexus'

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
        content: stringArg(),
        videoUrl: stringArg(),
        duration: intArg(),
      },
      async resolve(_, args, ctx) {
        console.log('🟢 createLesson resolver called with:', args)
        const lesson = await ctx.prisma.lesson.create({ data: args })
        console.log('✅ created lesson:', lesson)
        return lesson
      },
    })
  },
})
