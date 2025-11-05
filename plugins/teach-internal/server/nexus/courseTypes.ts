import { objectType, extendType, stringArg, floatArg, nonNull } from 'nexus'
import { fetchUserProfile } from '../../../../packages/shared-server/src/authBridge.js'

export const Course = objectType({
  name: 'Course',
  definition(t) {
    t.string('id')
    t.string('teacherId')
    t.string('title')
    t.string('category')
    t.string('difficulty')
    t.string('description')
    t.float('price')
    t.float('discount')
    t.string('coverUrl')
    t.list.field('modules', {
      type: 'Module',
      resolve: (p, _, ctx) => ctx.prisma.module.findMany({ where: { courseId: p.id } }),
    })
  },
})

export const CourseQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('coursesByTeacher', {
      type: 'Course',
      args: { teacherId: nonNull(stringArg()) },
      resolve(_, { teacherId }, ctx) {
        return ctx.prisma.course.findMany({ where: { teacherId } })
      },
    })

    t.field('course', {
      type: 'Course',
      args: { id: nonNull(stringArg()) },
      resolve(_, { id }, ctx) {
        return ctx.prisma.course.findUnique({ where: { id } })
      },
    })
  },
})

export const CourseMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createCourse', {
      type: 'Course',
      args: {
        title: nonNull(stringArg()),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
      },
      async resolve(_, args, ctx) {
        console.log('🟢 createCourse resolver called')

        const profile = await fetchUserProfile(ctx.user?.userId, ctx.token)
        console.log('✅ fetchUserProfile response:', profile)

        const course = await ctx.prisma.course.create({
          data: {
            ...args,
            teacherId: profile?.id || ctx.user?.userId || 'unknown',
          },
        })

        console.log('✅ created course:', course)
        return course
      },
    })
  },
})
