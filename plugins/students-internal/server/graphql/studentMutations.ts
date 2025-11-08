import { extendType, stringArg, nonNull, booleanArg, intArg } from 'nexus'

export const StudentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // ---- Enroll in a course ----
    t.field('enrollCourse', {
      type: 'StudentCourse',
      args: {
        studentId: nonNull(stringArg()),
        courseId: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        return ctx.prisma.studentCourse.upsert({
          where: { studentId_courseId: { studentId: args.studentId, courseId: args.courseId } },
          update: {},
          create: args,
        })
      },
    })

    // ---- Update lesson progress ----
    t.field('updateProgress', {
      type: 'StudentProgress', // still resolves to your LessonProgress table
      args: {
        studentId: nonNull(stringArg()),
        lessonId: nonNull(stringArg()),
        completed: booleanArg(),
        score: intArg(),
      },
      resolve: async (_, { studentId, lessonId, completed, score }, ctx) => {
        // Translate completed boolean → Prisma enum
        const status = completed === true ? 'COMPLETED' : 'IN_PROGRESS'

        return ctx.prisma.lessonProgress.upsert({
          where: { studentId_lessonId: { studentId, lessonId } },
          update: { status, score },
          create: { studentId, lessonId, status, score },
        })
      },
    })

    // ---- Submit a lesson (assignment/lab/file) ----
    t.field('submitLesson', {
      type: 'StudentSubmission',
      args: {
        studentId: nonNull(stringArg()),
        lessonId: nonNull(stringArg()),
        type: nonNull(stringArg()), // Prisma SubmissionType
        content: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        // cast type to match enum values (e.g., ASSIGNMENT, LAB, FILE)
        const submissionType = args.type.toUpperCase()
        return ctx.prisma.studentSubmission.create({
          data: {
            studentId: args.studentId,
            lessonId: args.lessonId,
            type: submissionType,
            content: args.content,
          },
        })
      },
    })
  },
})
