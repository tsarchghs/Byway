import { objectType, extendType, stringArg, nonNull } from 'nexus'
import { canUser, resolveInstitutionRole, canAccessCourse } from '../permissions.mjs'

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
        if (!institutionId) {
          return ctx.prisma.module.findMany({
            where: { courseId },
            include: { lessons: true },
          })
        }
        const allowed = await canAccessCourse(ctx.user, { req: ctx.req, courseId, institutionId, classroomIds: instCtx?.classroomId ? [instCtx.classroomId] : [] })
        if (!allowed) throw new Error('FORBIDDEN')
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
      async resolve(_, { courseId, title }, ctx) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null)
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.module.create({ data: { courseId, title } })
      },
    })

    t.field('updateModule', {
      type: 'GqlModule',
      args: { id: nonNull(stringArg()), title: stringArg() },
      async resolve(_, { id, title }, ctx) {
        const mod = await ctx.prisma.module.findUnique({ where: { id } })
        const courseId = mod?.courseId || ''
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.module.update({ where: { id }, data: { title: title ?? undefined } })
      },
    })

    t.field('deleteModule', {
      type: 'GqlModule',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const mod = await ctx.prisma.module.findUnique({ where: { id } })
        const courseId = mod?.courseId || ''
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
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
      async resolve(_root, args, ctx) {
        const mod = await ctx.prisma.module.findUnique({ where: { id: args.id } })
        const courseId = mod?.courseId || ''
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        if (!institutionId) {
          return ctx.prisma.module.findUnique({ where: { id: args.id } })
        }
        const allowed = await canAccessCourse(ctx.user, { req: ctx.req, courseId, institutionId, classroomIds: instCtx?.classroomId ? [instCtx.classroomId] : [] })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.module.findUnique({ where: { id: args.id } })
      },
    })
  },
})
