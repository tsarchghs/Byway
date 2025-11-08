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
  },
})
