import { extendType, stringArg, nonNull } from 'nexus'

export const StudentQuery = extendType({
  type: 'Query',
  definition(t) {
    // Get all enrolled courses for this student
    t.list.field('myCourses', {
      type: 'StudentCourse',
      args: { studentId: nonNull(stringArg()) },
      resolve: (_, { studentId }, ctx) =>
        ctx.prisma.studentCourse.findMany({
          where: { studentId },
          orderBy: { enrolledAt: 'desc' },
        }),
    })

    // Get lesson progress for this student (from LessonProgress model)
    t.list.field('myProgress', {
      type: 'StudentProgress',
      args: { studentId: nonNull(stringArg()) },
      resolve: (_, { studentId }, ctx) =>
        ctx.prisma.lessonProgress.findMany({
          where: { studentId },
          orderBy: { updatedAt: 'desc' },
        }),
    })

    // Get lesson submissions for this student
    t.list.field('mySubmissions', {
      type: 'StudentSubmission',
      args: { studentId: nonNull(stringArg()) },
      resolve: (_, { studentId }, ctx) =>
        ctx.prisma.studentSubmission.findMany({
          where: { studentId },
          orderBy: { submittedAt: 'desc' },
        }),
    })

    // Check enrollment for a specific student id
    t.field('isEnrolled', {
      type: 'Boolean',
      args: { studentId: nonNull(stringArg()), courseId: nonNull(stringArg()) },
      resolve: async (_, { studentId, courseId }, ctx) => {
        const sc = await ctx.prisma.studentCourse.findUnique({
          where: { studentId_courseId: { studentId, courseId } },
        })
        return !!sc
      },
    })

    // Check enrollment for current authenticated user
    t.field('isEnrolledMe', {
      type: 'Boolean',
      args: { courseId: nonNull(stringArg()) },
      resolve: async (_, { courseId }, ctx) => {
        if (!ctx.user?.userId) return false
        const student = await ctx.prisma.student.findUnique({ where: { userId: ctx.user.userId } })
        if (!student) return false
        const sc = await ctx.prisma.studentCourse.findUnique({
          where: { studentId_courseId: { studentId: student.id, courseId } },
        })
        return !!sc
      },
    })

    // Check whether a student exists by Student.id
    t.field('studentExists', {
      type: 'Boolean',
      args: { studentId: nonNull(stringArg()) },
      resolve: async (_, { studentId }, ctx) => {
        const s = await ctx.prisma.student.findUnique({ where: { id: studentId } })
        return !!s
      },
    })

    // Get student by authentication user id (soft link userId -> authentication.user.id)
    t.field('studentByUserId', {
      type: 'Student',
      args: { userId: nonNull(stringArg()) },
      resolve: async (_, { userId }, ctx) => {
        return ctx.prisma.student.findUnique({ where: { userId } })
      },
    })
  },
})

// Added surgically: check if a student is enrolled in a course
t.field('hasEnrollment', {
  type: 'Boolean',
  args: {
    studentId: nonNull(stringArg()),
    courseId: nonNull(stringArg()),
  },
  async resolve(_root, args, ctx) {
    const e = await ctx.prisma.enrollment.findFirst({
      where: { studentId: args.studentId, courseId: args.courseId },
      select: { id: true },
    }).catch(() => null)
    return !!e
  },
})

// Added surgically: enrollment count by classroom
t.field('enrollmentCountByClassroom', {
  type: 'Int',
  args: { classroomId: nonNull(stringArg()) },
  resolve: async (_root, args, ctx) => {
    return ctx.prisma.studentCourse.count({ where: { classroomId: args.classroomId } })
  },
})
