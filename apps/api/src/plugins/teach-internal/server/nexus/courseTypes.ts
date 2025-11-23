// src/graphql/courseTypes.ts
import { objectType, extendType, stringArg, floatArg, nonNull, arg } from 'nexus'
import { canUser, resolveInstitutionRole, canAccessCourse } from '../permissions.mjs'
import { callGraphQL } from '../graphql/callPlugins'

function getCurrentUserId(ctx: any) {
  return ctx?.user?.userId || ctx?.user?.id || ctx?.user?.sub || null
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' ? (value as Record<string, any>) : {}
}

async function fetchCourseMetadata(prisma: any, id: string) {
  const existing = await prisma.course.findUnique({
    where: { id },
    select: { metadata: true },
  })
  return asRecord(existing?.metadata)
}

function mergeCourseMetadata(base: Record<string, any>, patch: Record<string, any>) {
  const next = { ...asRecord(base) }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    next[key] = value
  }
  return Object.keys(next).length ? next : undefined
}

export const GqlCourse = objectType({
  name: 'GqlCourse',
  definition(t) {
    t.string('id')
    t.string('teacherId')
    t.string('title')
    t.nullable.string('institutionId')
    t.nullable.string('category')
    t.nullable.string('difficulty')
    t.nullable.string('description')
    t.float('price')
    t.float('discount')
    t.nullable.string('coverUrl')
    t.list.field('modules', { type: 'GqlModule' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('files', {
      type: 'JSON',
      resolve: (parent) => {
        const meta = asRecord((parent as any)?.metadata)
        return meta?.files || []
      },
    })
    // Enrollment flag: resolved via students-internal when JWT is present
    t.boolean('isEnrolled', {
      resolve: async (parent, _args, ctx) => {
        try {
          const STUDENTS_API = '/api/students-internal/graphql'
          const q = `query ($courseId: String!) { isEnrolledMe(courseId: $courseId) }`
          if (!ctx?.token) return false
          const d = await callGraphQL(STUDENTS_API, q, { courseId: parent.id }, ctx.token)
          return !!d?.isEnrolledMe
        } catch (e) {
          // On error, don't leak details — treat as not enrolled
          console.warn('[teach-internal] isEnrolled resolver error', (e as any)?.message || e)
          return false
        }
      },
    })
  },
})

export const CourseQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('courses', {
      type: 'GqlCourse',
      async resolve(_, __, ctx) {
        const items = await ctx.prisma.course.findMany({
          include: { modules: { include: { lessons: true } } },
        })
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const out = []
        for (const c of Array.isArray(items) ? items : []) {
          const r = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(c.id)}/institution-context`).catch(() => null)
          const inst = r && (await r.json().catch(() => null))
          const institutionId = inst?.institutionId || null
          if (!institutionId) {
            out.push(c)
            continue
          }
          const ok = await canAccessCourse(ctx.user, { req: ctx.req, courseId: c.id, institutionId, classroomIds: inst?.classroomId ? [inst.classroomId] : [] })
          if (ok) out.push(c)
        }
        return out
      },
    })

    t.field('course', {
      type: 'GqlCourse',
      args: { id: nonNull(stringArg()) },
      async resolve(_, { id }, ctx) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const authHeader = ctx.req.headers.authorization || ''
        const instResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(id)}/institution-context`).catch(() => null)
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        if (!institutionId) {
          return ctx.prisma.course.findUnique({
            where: { id },
            include: { modules: { include: { lessons: true } } },
          })
        }
        const allowed = await canAccessCourse(ctx.user, { req: ctx.req, courseId: id, institutionId, classroomIds: instCtx?.classroomId ? [instCtx.classroomId] : [] })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.course.findUnique({
          where: { id },
          include: { modules: { include: { lessons: true } } },
        })
      },
    })

    t.list.field('myCourses', {
      type: 'GqlCourse',
      args: {
        teacherId: stringArg(),
        institutionId: stringArg(),
      },
      async resolve(_, args, ctx) {
        const teacherId = args.teacherId || getCurrentUserId(ctx)
        if (!teacherId) throw new Error('Not authenticated')
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : null)
        const allowed = await canUser('course.edit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')

        const where: Record<string, string> = { teacherId }
        if (args.institutionId) where.institutionId = args.institutionId

        return ctx.prisma.course.findMany({
          where,
          include: { modules: { include: { lessons: true } } },
          orderBy: { updatedAt: 'desc' },
        })
      },
    })
  },
})

export const CourseMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createCourse', {
      type: 'GqlCourse',
      args: {
        teacherId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
        coverUrl: stringArg(),
        files: arg({ type: 'JSON' }),
      },
      resolve: async (_, args, ctx) => {
          const token = ctx?.token
          if (!token) throw new Error('Not authenticated')

          // Determine permission in two ways:
          // 1) Role-based: user has 'teacher' or 'admin' role
          const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : null)
          let allowedEdit = await canUser('course.edit', { user: ctx.user, role })

          // 2) Profile-based: user owns the teacherProfileId matching the provided teacherId
          let ownsTeacherProfile = false
          try {
            const authResp = await callGraphQL('/api/authentication/graphql', `query { me { id teacherProfileId } }`, {}, token)
            const me = authResp?.me
            if (me?.teacherProfileId && String(me.teacherProfileId) === String(args.teacherId)) {
              ownsTeacherProfile = true
            }
          } catch {}

          if (!allowedEdit && !ownsTeacherProfile) throw new Error('FORBIDDEN')

          // Best-effort: verify teacher profile exists in teach plugin, do not block creation
          try {
            const teachResp = await callGraphQL('/api/teach/graphql', `query ($id: String!) { teacherProfile(id:$id){ id } }`, { id: args.teacherId })
            if (!teachResp?.teacherProfile?.id) {
              console.warn('[teach-internal] teacher profile not found in teach plugin, continuing for local creation')
            }
          } catch (err) {
            console.warn('[teach-internal] teacher profile lookup failed, allowing createCourse anyway:', (err as any)?.message || err)
          }

          const { files, ...courseData } = args
          const metadata = files !== undefined ? mergeCourseMetadata({}, { files }) : undefined
          return ctx.prisma.course.create({
            data: {
              ...courseData,
              ...(metadata ? { metadata } : {}),
            },
          })
        },
    })

    t.field('updateCourse', {
      type: 'GqlCourse',
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
        coverUrl: stringArg(),
        files: arg({ type: 'JSON' }),
      },
      resolve: async (_, args, ctx) => {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const authHeader = ctx.req.headers.authorization || ''
        const instResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(args.id)}/institution-context`).catch(() => null)
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowedEdit = await canUser('course.edit', { user: ctx.user, role })
        if (!allowedEdit) throw new Error('FORBIDDEN')
        const { id, files, ...data } = args
        let metadataPatch
        if (files !== undefined) {
          const current = await fetchCourseMetadata(ctx.prisma, id)
          metadataPatch = mergeCourseMetadata(current, { files })
        }
        return ctx.prisma.course.update({
          where: { id },
          data: {
            ...data,
            ...(metadataPatch ? { metadata: metadataPatch } : {}),
          },
        })
      },
    })

    t.field('deleteCourse', {
      type: 'GqlCourse',
      args: { id: nonNull(stringArg()) },
      resolve: async (_, { id }, ctx) => {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const instResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(id)}/institution-context`).catch(() => null)
        const instCtx = instResp && (await instResp.json().catch(() => null))
        const institutionId = instCtx?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowedEdit = await canUser('course.edit', { user: ctx.user, role })
        if (!allowedEdit) throw new Error('FORBIDDEN')
        return ctx.prisma.course.delete({ where: { id } })
      },
    })
  },
})
