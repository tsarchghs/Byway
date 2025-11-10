import { objectType, extendType, nonNull, stringArg, floatArg } from 'nexus'

export const Assignment = objectType({
  name: 'Assignment',
  definition(t) {
    t.string('id')
    t.string('classroomId')
    t.string('title')
    t.string('description')
    t.field('dueDate', { type: 'DateTime' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const Submission = objectType({
  name: 'Submission',
  definition(t) {
    t.string('id')
    t.string('assignmentId')
    t.string('studentId')
    t.nullable.string('fileUrl')
    t.nullable.float('grade')
    t.nullable.string('feedback')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const AssignmentQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('assignmentsByClassroom', {
      type: 'Assignment',
      args: { classroomId: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.assignment.findMany({
        where: { classroomId: args.classroomId },
        orderBy: { dueDate: 'asc' },
      }),
    })
    t.list.field('submissionsByAssignment', {
      type: 'Submission',
      args: { assignmentId: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.submission.findMany({
        where: { assignmentId: args.assignmentId },
        orderBy: { createdAt: 'desc' },
      }),
    })
  },
})

export const AssignmentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAssignment', {
      type: 'Assignment',
      args: {
        classroomId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        dueDate: nonNull(stringArg()),
      },
      resolve: (_root, args, ctx) => ctx.prisma.assignment.create({
        data: {
          classroomId: args.classroomId,
          title: args.title,
          description: args.description,
          dueDate: new Date(args.dueDate),
        } as any,
      }),
    })

    t.field('gradeSubmission', {
      type: 'Submission',
      args: {
        id: nonNull(stringArg()),
        grade: nonNull(floatArg()),
        feedback: stringArg(),
      },
      resolve: (_root, args, ctx) => ctx.prisma.submission.update({
        where: { id: args.id },
        data: { grade: args.grade, feedback: args.feedback ?? null },
      }),
    })
  },
})

export const SubmissionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('mySubmissions', {
      type: 'Submission',
      args: { studentId: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.submission.findMany({
        where: { studentId: args.studentId },
        orderBy: { createdAt: 'desc' },
      }),
    })
  },
})

export const SubmissionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSubmission', {
      type: 'Submission',
      args: {
        assignmentId: nonNull(stringArg()),
        studentId: nonNull(stringArg()),
        fileUrl: stringArg(),
      },
      resolve: (_root, args, ctx) => ctx.prisma.submission.create({
        data: {
          assignmentId: args.assignmentId,
          studentId: args.studentId,
          fileUrl: args.fileUrl ?? null,
        } as any,
      }),
    })
  },
})
