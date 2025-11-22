import { objectType, extendType, nonNull, stringArg } from 'nexus'
import { canUser, resolveInstitutionRole } from '../permissions.mjs'

export const GqlClassroom = objectType({
  name: 'GqlClassroom',
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
      type: 'GqlClassroom',
      args: { courseId: nonNull(stringArg()) },
      async resolve(_root, args, ctx) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(args.courseId)}/institution-context`).catch(() => null)
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.view', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.classroom.findMany({
          where: { courseId: args.courseId },
          orderBy: { createdAt: 'desc' },
        })
      },
    })
  },
})

export const ClassroomMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createClassroom', {
      type: 'GqlClassroom',
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
