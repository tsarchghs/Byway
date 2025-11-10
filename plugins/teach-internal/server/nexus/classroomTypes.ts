import { objectType, extendType, nonNull, stringArg } from 'nexus'

export const Classroom = objectType({
  name: 'Classroom',
  definition(t) {
    t.string('id')
    t.string('courseId')
    t.nullable.string('institutionId')
    t.string('name')
    t.field('startDate', { type: 'DateTime' })
    t.field('endDate', { type: 'DateTime' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const ClassroomQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('classroomsByCourse', {
      type: 'Classroom',
      args: { courseId: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.classroom.findMany({
        where: { courseId: args.courseId },
        orderBy: { createdAt: 'desc' },
      }),
    })
  },
})

export const ClassroomMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createClassroom', {
      type: 'Classroom',
      args: {
        courseId: nonNull(stringArg()),
        name: nonNull(stringArg()),
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
        institutionId: stringArg(),
      },
      resolve: (_root, args, ctx) => ctx.prisma.classroom.create({
        data: {
          courseId: args.courseId,
          name: args.name,
          startDate: new Date(args.startDate),
          endDate: new Date(args.endDate),
          institutionId: args.institutionId ?? null,
        } as any,
      }),
    })
  },
})
