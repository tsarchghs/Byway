import { objectType, extendType, stringArg, intArg, nonNull, arg } from 'nexus'
import { canUser, resolveInstitutionRole } from '../permissions.mjs'

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
      resolve: (_, args, ctx) => ctx.prisma.lesson.create({ data: args as any }),
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
      resolve: async (_, { id, ...data }, ctx) =>
        ctx.prisma.lesson.update({
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
        }),
    })

    t.field('deleteLesson', {
      type: 'GqlLesson',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) => ctx.prisma.lesson.delete({ where: { id } }),
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
