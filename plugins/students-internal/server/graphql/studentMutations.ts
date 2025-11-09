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

    // Enroll current authenticated user (create Student if needed)
    t.field('enrollMe', {
      type: 'StudentCourse',
      args: { courseId: nonNull(stringArg()) },
      resolve: async (_, { courseId }, ctx) => {
        if (!ctx.user?.userId) throw new Error('Not authenticated')
        // find or create Student by userId
        let student = await ctx.prisma.student.findUnique({ where: { userId: ctx.user.userId } })
        if (!student) {
          student = await ctx.prisma.student.create({ data: { userId: ctx.user.userId } })
        }
        return ctx.prisma.studentCourse.upsert({
          where: { studentId_courseId: { studentId: student.id, courseId } },
          update: {},
          create: { studentId: student.id, courseId },
        })
      },
    })

    // Create (or find) a Student record for a given authentication user id
    t.field('createStudent', {
      type: 'Student',
      args: {
        userId: nonNull(stringArg()),
        displayName: stringArg(),
      },
      resolve: async (_, { userId, displayName }, ctx) => {
        // upsert by unique userId
        return ctx.prisma.student.upsert({
          where: { userId },
          update: { displayName: displayName ?? undefined },
          create: { userId, displayName: displayName ?? undefined },
        })
      },
    })

    // Enroll a student by id (admin flow)
    t.field('enrollStudent', {
      type: 'StudentCourse',
      args: {
        studentId: nonNull(stringArg()),
        courseId: nonNull(stringArg()),
      },
      resolve: async (_, { studentId, courseId }, ctx) => {
        // idempotent upsert
        return ctx.prisma.studentCourse.upsert({
          where: { studentId_courseId: { studentId, courseId } },
          update: {},
          create: { studentId, courseId },
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
