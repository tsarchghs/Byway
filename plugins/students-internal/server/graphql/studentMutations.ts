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

// Added surgically: enroll a student into a classroom (or update existing enrollment)
t.field('enrollInClassroom', {
  type: 'String', // returns enrollment id or "OK"
  args: {
    studentId: nonNull(stringArg()),
    courseId: nonNull(stringArg()),
    classroomId: nonNull(stringArg()),
  },
  async resolve(_root, args, ctx) {
    const { studentId, courseId, classroomId } = args
    // 1) find enrollment by unique (studentId, courseId) if it exists
    const existing = await ctx.prisma.$queryRawUnsafe(
      `SELECT id FROM Enrollment WHERE studentId = ? AND courseId = ? LIMIT 1`,
      studentId, courseId
    ).catch(() => null)

    if (Array.isArray(existing) && existing.length > 0) {
      const id = existing[0].id
      await ctx.prisma.enrollment.update({ where: { id }, data: { classroomId } })
      return id
    }

    // if there's a different model name, fallback: try prisma.enrollment upsert
    try {
      const created = await ctx.prisma.enrollment.create({
        data: { studentId, courseId, classroomId } as any,
      })
      return created.id
    } catch {
      // Some repos name it StudentCourse or similar; try generic raw insert
      await ctx.prisma.$executeRawUnsafe(
        `INSERT INTO Enrollment (id, studentId, courseId, classroomId) VALUES (lower(hex(randomblob(16))), ?, ?, ?)`,
        studentId, courseId, classroomId
      )
      return 'OK'
    }
  },
})

// Added surgically: bulk enrollment via CSV (studentId,courseId[,classroomId])
t.field('bulkEnrollCsv', {
  type: 'Int', // returns number of processed rows
  args: { csv: nonNull(stringArg()) },
  async resolve(_root, args, ctx) {
    const lines = args.csv.split(/\r?\n/).filter(Boolean)
    let count = 0
    for (const line of lines) {
      const [studentId, courseId, classroomId] = line.split(',').map(s=>s?.trim())
      if (!studentId || !courseId) continue
      try {
        const existing = await ctx.prisma.enrollment.findFirst({ where: { studentId, courseId }, select: { id: true } })
        if (existing) {
          await ctx.prisma.enrollment.update({ where: { id: existing.id }, data: { classroomId: classroomId ?? undefined } })
        } else {
          await ctx.prisma.enrollment.create({ data: { studentId, courseId, classroomId: classroomId ?? null } as any })
        }
        count++
      } catch {}
    }
    return count
  },
})
