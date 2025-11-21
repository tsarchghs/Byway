import { objectType, extendType, stringArg, nonNull } from 'nexus'
import { canUser, resolveInstitutionRole } from '../permissions.mjs'

export const GqlModule = objectType({
  name: 'GqlModule',
  definition(t) {
    t.string('id')
    t.string('courseId')
    t.string('title')
    t.list.field('lessons', { type: 'GqlLesson' })
  },
})

export const ModuleQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('modulesByCourse', {
      type: 'GqlModule',
      args: { courseId: nonNull(stringArg()) },
      async resolve(_, { courseId }, ctx) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const authHeader = ctx.req.headers.authorization || ''
        const instResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null)
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const allowed = await canUser('course.view', { user: ctx.user, institutionId, req: ctx.req })
        if (!allowed) throw new Error('FORBIDDEN')
        if (institutionId && ctx.user?.id) {
          const roomsResp = await fetch(`${baseUrl}/api/institutions/graphql`, {
            method: 'POST', headers: { 'content-type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
            body: JSON.stringify({ query: `query($institutionId:String){ classrooms(institutionId:$institutionId){ id enrollments{ studentId status } } }`, variables: { institutionId } })
          }).catch(() => null)
          const roomsJson = roomsResp && (await roomsResp.json().catch(() => null))
          const arr = Array.isArray(roomsJson?.data?.classrooms) ? roomsJson.data.classrooms : []
          const room = instCtx?.classroomId ? arr.find((r: any) => r.id === instCtx.classroomId) : null
          const role = await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req)
          if (role === 'student') {
            const enrolled = room ? (Array.isArray(room.enrollments) ? room.enrollments.some((en: any) => en.studentId === ctx.user.id && String(en.status || '').toUpperCase() !== 'REMOVED') : false) : false
            if (!enrolled) throw new Error('FORBIDDEN')
          }
        }
        return ctx.prisma.module.findMany({
          where: { courseId },
          include: { lessons: true },
        })
      },
    })
  },
})

export const ModuleMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createModule', {
      type: 'GqlModule',
      args: { courseId: nonNull(stringArg()), title: nonNull(stringArg()) },
      resolve: (_, { courseId, title }, ctx) =>
        ctx.prisma.module.create({ data: { courseId, title } }),
    })

    t.field('updateModule', {
      type: 'GqlModule',
      args: { id: nonNull(stringArg()), title: stringArg() },
      resolve: (_, { id, title }, ctx) =>
        ctx.prisma.module.update({ where: { id }, data: { title: title ?? undefined } }),
    })

    t.field('deleteModule', {
      type: 'GqlModule',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        // cascade delete lessons (Prisma relation mode handles, but ensure if needed)
        return ctx.prisma.module.delete({ where: { id } })
      },
    })
  },
})

export const ModuleQueryById = extendType({
  type: 'Query',
  definition(t) {
    t.field('moduleById', {
      type: 'GqlModule',
      args: { id: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.module.findUnique({ where: { id: args.id } }),
    })
  },
})
