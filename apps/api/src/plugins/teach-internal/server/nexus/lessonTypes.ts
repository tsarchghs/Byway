import { objectType, extendType, stringArg, intArg, nonNull, arg } from 'nexus'
import { canUser, resolveInstitutionRole, canAccessCourse } from '../permissions.mjs'

export const GqlLesson = objectType({
  name: 'GqlLesson',
  definition(t) {
    t.string('id')
    t.string('moduleId')
    t.string('title')
    t.string('type')
    t.nullable.int('duration')
    t.nullable.string('content')
    t.nullable.string('videoUrl')
    t.nullable.string('rubric')
    t.boolean('preview')
    t.nullable.field('metadata', { type: 'JSON' }) // <- lab, quiz, resources, etc.
    t.field('createdAt', { type: 'DateTime' })
  },
})

export const LessonQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('lessonsByModule', {
      type: 'GqlLesson',
      args: { moduleId: nonNull(stringArg()) },
      async resolve(_, { moduleId }, ctx) {
        const mod = await ctx.prisma.module.findUnique({ where: { id: moduleId } })
        const courseId = mod?.courseId || null
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const authHeader = ctx.req.headers.authorization || ''
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        if (!institutionId) {
          return ctx.prisma.lesson.findMany({ where: { moduleId } })
        }
        const allowed = await canAccessCourse(ctx.user, { req: ctx.req, courseId, institutionId, classroomIds: instCtx?.classroomId ? [instCtx.classroomId] : [] })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.lesson.findMany({ where: { moduleId } })
      },
    })
  },
})

export const LessonMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createLesson', {
      type: 'GqlLesson',
      args: {
        moduleId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        type: nonNull(stringArg()),
        duration: intArg(),
        content: stringArg(),
        videoUrl: stringArg(),
        rubric: stringArg(),
        metadata: arg({ type: 'JSON' }),
      },
      async resolve(_, args, ctx) {
        const mod = await ctx.prisma.module.findUnique({ where: { id: args.moduleId } })
        const courseId = mod?.courseId || ''
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.lesson.create({ data: args as any })
      },
    })

    t.field('updateLesson', {
      type: 'GqlLesson',
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
        type: stringArg(),
        duration: intArg(),
        content: stringArg(),
        videoUrl: stringArg(),
        rubric: stringArg(),
        metadata: arg({ type: 'JSON' }),
      },
      async resolve(_, { id, ...data }, ctx) {
        const lesson = await ctx.prisma.lesson.findUnique({ where: { id } })
        const mod = lesson?.moduleId ? await ctx.prisma.module.findUnique({ where: { id: lesson.moduleId } }) : null
        const courseId = mod?.courseId || ''
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.lesson.update({
          where: { id },
          data: {
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.type !== undefined ? { type: data.type } : {}),
            ...(data.duration !== undefined ? { duration: data.duration } : {}),
            ...(data.content !== undefined ? { content: data.content } : {}),
            ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
            ...(data.rubric !== undefined ? { rubric: data.rubric } : {}),
            ...(data.metadata !== undefined ? { metadata: data.metadata as any } : {}),
          },
        })
      },
    })

    t.field('deleteLesson', {
      type: 'GqlLesson',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const lesson = await ctx.prisma.lesson.findUnique({ where: { id } })
        const mod = lesson?.moduleId ? await ctx.prisma.module.findUnique({ where: { id: lesson.moduleId } }) : null
        const courseId = mod?.courseId || ''
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = courseId ? await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(courseId)}/institution-context`).catch(() => null) : null
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.lesson.delete({ where: { id } })
      },
    })
  },
})

export const LessonReorderMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('reorderLessons', {
      type: 'Boolean',
      args: {
        moduleId: nonNull(stringArg()),
        ids: nonNull(list(nonNull(stringArg()))),
      },
      async resolve(_root, args, ctx) {
        const ids = args.ids
        for (let i = 0; i < ids.length; i++) {
          await ctx.prisma.lesson.update({ where: { id: ids[i] }, data: { position: i } })
        }
        return true
      }
    })
  }
})
