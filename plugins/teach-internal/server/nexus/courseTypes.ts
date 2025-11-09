// src/graphql/courseTypes.ts
import { objectType, extendType, stringArg, floatArg, nonNull } from 'nexus'
import { callGraphQL } from '../graphql/callPlugins'

export const Course = objectType({
  name: 'Course',
  definition(t) {
    t.string('id')
    t.string('teacherId')
    t.string('title')
    t.nullable.string('category')
    t.nullable.string('difficulty')
    t.nullable.string('description')
    t.float('price')
    t.float('discount')
    t.nullable.string('coverUrl')
    t.list.field('modules', { type: 'Module' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    // Enrollment flag: resolved via students-internal when JWT is present
    t.boolean('isEnrolled', {
      resolve: async (parent, _args, ctx) => {
        try {
          const STUDENTS_API = '/api/students-internal/graphql'
          const q = `query ($courseId: String!) { isEnrolledMe(courseId: $courseId) }`
          if (!ctx?.token) return false
          const d = await callGraphQL(STUDENTS_API, q, { courseId: parent.id }, ctx.token)
          return !!d?.isEnrolledMe
        } catch (e) {
          // On error, don't leak details — treat as not enrolled
          console.warn('[teach-internal] isEnrolled resolver error', (e as any)?.message || e)
          return false
        }
      },
    })
  },
})

export const CourseQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('courses', {
      type: 'Course',
      resolve: (_, __, ctx) =>
        ctx.prisma.course.findMany({
          include: { modules: { include: { lessons: true } } },
        }),
    })

    t.field('course', {
      type: 'Course',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        return ctx.prisma.course.findUnique({
          where: { id },
          include: { modules: { include: { lessons: true } } },
        })
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
        teacherId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
        coverUrl: stringArg(),
      },
      resolve: async (_, args, ctx) => {
          // require authenticated user and ensure they own the teacher profile
          const token = ctx?.token
          if (!token) throw new Error('Not authenticated')

          try {
            // 1) verify current user via authentication plugin
            const authResp = await callGraphQL('/api/authentication/graphql', `query { me { id teacherProfileId } }`, {}, token)
            const me = authResp?.me
            if (!me) throw new Error('Could not verify user with authentication service')
            if (me.teacherProfileId !== args.teacherId) throw new Error('You are not allowed to create a course for this teacher profile')

            // 2) ensure teacher profile is verified in the teach plugin
            const teachResp = await callGraphQL('/api/teach/graphql', `query ($id: String!) { teacherProfile(id:$id){ verified } }`, { id: args.teacherId })
            if (!teachResp?.teacherProfile?.verified) throw new Error('Teacher profile is not verified')

            return ctx.prisma.course.create({ data: args })
          } catch (e) {
            throw new Error((e as any)?.message || 'Failed to create course')
          }
        },
    })

    t.field('updateCourse', {
      type: 'Course',
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
        coverUrl: stringArg(),
      },
      resolve: async (_, { id, ...data }, ctx) =>
        ctx.prisma.course.update({ where: { id }, data }),
    })

    t.field('deleteCourse', {
      type: 'Course',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) => ctx.prisma.course.delete({ where: { id } }),
    })
  },
})
