// plugins/institutions/server/graphql/resolvers.js
import { PrismaClient } from '../db/generated/index'
import { resolveUser, resolveInstitutionRole, canUser } from '../permissions.mjs'
const prismaSingleton = new PrismaClient()
export async function getPrisma() {
  return prismaSingleton
}

export const resolvers = {
  Query: {
    institutions: async (_parent, _args, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const allowed = await canUser('course.view', { user })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.institution) return []
      return prisma.institution.findMany({
        orderBy: { createdAt: 'desc' },
        include: { departments: true, classrooms: true, members: true },
      })
    },

    institution: async (_parent, { id }, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const allowed = await canUser('course.view', { user })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.institution) return null
      return prisma.institution.findUnique({ where: { id }, include: { departments: true, classrooms: true, members: true } })
    },

    institutionBySlug: async (_parent, { slug }, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const allowed = await canUser('course.view', { user })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.institution) return null
      return prisma.institution.findUnique({ where: { slug }, include: { departments: true, classrooms: true, members: true } })
    },

    departments: async (_parent, { institutionId }, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && institutionId ? await resolveInstitutionRole(user.id, institutionId, reqLike) : null
      const allowed = await canUser('institution.student', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.department) return []
      return prisma.department.findMany({ where: { institutionId }, orderBy: { createdAt: 'desc' } })
    },

    classrooms: async (_parent, { institutionId, departmentId }, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && institutionId ? await resolveInstitutionRole(user.id, institutionId, reqLike) : null
      const allowed = await canUser('institution.student', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.classroom) return []
      return prisma.classroom.findMany({
        where: { ...(institutionId ? { institutionId } : {}), ...(departmentId ? { departmentId } : {}) },
        orderBy: { createdAt: 'desc' },
        include: { enrollments: true },
      })
    },

    members: async (_parent, { institutionId, role }, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const r = user?.id && institutionId ? await resolveInstitutionRole(user.id, institutionId, reqLike) : null
      const allowed = await canUser('institution.admin', { user, role: r })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) return []
      return prisma.institutionMember.findMany({
        where: { institutionId, ...(role ? { role } : {}) },
        orderBy: { createdAt: 'desc' },
      })
    },

    stats: async (_parent, { institutionId }, ctx) => {
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && institutionId ? await resolveInstitutionRole(user.id, institutionId, reqLike) : null
      const allowed = await canUser('institution.teacher', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const prisma = await getPrisma()
      if (!prisma?.institution) return null
      const [classrooms, departments, members, enrollments] = await Promise.all([
        prisma.classroom.count({ where: { institutionId } }),
        prisma.department.count({ where: { institutionId } }),
        prisma.institutionMember.count({ where: { institutionId } }),
        prisma.classroomEnrollment.count({ where: { classroom: { institutionId } } }),
      ])
      const activeClassrooms = await prisma.classroom.count({ where: { institutionId, status: 'active' } })
      return {
        classrooms,
        activeClassrooms,
        departments,
        members,
        students: enrollments,
      }
    },
  },

  Mutation: {
  createInstitution: async (_, { data }, ctx) => {
    if (!ctx.user?.id) throw new Error("Not authenticated")

    // 1) Create institution
    const inst = await ctx.prisma.institution.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        location: data.location,
        email: data.email,
        phone: data.phone,
      }
    })

    // 2) Attach creator as ADMIN
    await ctx.prisma.institutionMember.create({
      data: {
        userId: ctx.user.id,
        institutionId: inst.id,
        role: "admin"
      }
    })

    return inst
  }
,

updateInstitution: async (_parent, { id, ...data }, ctx) => {
  const prisma = await getPrisma()
  if (!prisma?.institution) throw new Error('Prisma not ready for Institution')

  // Resolve user normally from your authentication plugin
  const reqLike = { 
    headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' },
    protocol: 'http',
    get: () => 'localhost:3000' // required by resolveInstitutionRole()
  }

  const user = await resolveUser(reqLike).catch(() => null)
  if (!user?.id) throw new Error('UNAUTHENTICATED')

  // Prepare context for canUser
  const permCtx = {
    user,
    institutionId: id,   // <── THIS IS CRITICAL
    req: reqLike
  }

  const allowed = await canUser('institution.edit', permCtx)
  if (!allowed) throw new Error('FORBIDDEN')

  return prisma.institution.update({
    where: { id },
    data
  })
},


    createDepartment: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.department) throw new Error('Prisma not ready for Department')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && args?.institutionId ? await resolveInstitutionRole(user.id, args.institutionId, reqLike) : null
      const allowed = await canUser('institution.admin', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      return prisma.department.create({ data: args })
    },

    updateDepartment: async (_parent, { id, ...data }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.department) throw new Error('Prisma not ready for Department')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && data?.institutionId ? await resolveInstitutionRole(user.id, data.institutionId, reqLike) : null
      const allowed = await canUser('institution.admin', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      return prisma.department.update({ where: { id }, data })
    },

    createClassroom: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) throw new Error('Prisma not ready for Classroom')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && args?.institutionId ? await resolveInstitutionRole(user.id, args.institutionId, reqLike) : null
      const allowed = await canUser('classroom.edit', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const { name, ...rest } = args
      const title = args.title || name
      const data = { ...rest, title }
      if (typeof args.courseIds === 'string') data.courseIds = args.courseIds
      return prisma.classroom.create({ data })
    },

    updateClassroom: async (_parent, { id, ...data }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) throw new Error('Prisma not ready for Classroom')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && data?.institutionId ? await resolveInstitutionRole(user.id, data.institutionId, reqLike) : null
      const allowed = await canUser('classroom.edit', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const { name, title, ...rest } = data
      const next = { ...rest }
      if (title || name) next.title = title || name
      if (typeof data.courseIds === 'string') next.courseIds = data.courseIds
      return prisma.classroom.update({ where: { id }, data: next })
    },

    addMember: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) throw new Error('Prisma not ready for InstitutionMember')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && args?.institutionId ? await resolveInstitutionRole(user.id, args.institutionId, reqLike) : null
      const allowed = await canUser('institution.admin', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      return prisma.institutionMember.upsert({
        where: { institutionId_userId: { institutionId: args.institutionId, userId: args.userId } },
        create: args,
        update: { role: args.role, status: args.status || 'ACTIVE' },
      })
    },

    removeMember: async (_parent, { id }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) throw new Error('Prisma not ready for InstitutionMember')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const allowed = await canUser('institution.admin', { user, role: 'admin' })
      if (!allowed) throw new Error('FORBIDDEN')
      await prisma.institutionMember.delete({ where: { id } })
      return true
    },

    updateMemberRole: async (_parent, { id, role, status }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) throw new Error('Prisma not ready for InstitutionMember')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const allowed = await canUser('institution.admin', { user, role: 'admin' })
      if (!allowed) throw new Error('FORBIDDEN')
      return prisma.institutionMember.update({ where: { id }, data: { role, ...(status ? { status } : {}) } })
    },

    createInvite: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionInvite) throw new Error('Prisma not ready for InstitutionInvite')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      const role = user?.id && args?.institutionId ? await resolveInstitutionRole(user.id, args.institutionId, reqLike) : null
      const allowed = await canUser('institution.admin', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const code = Math.random().toString(36).slice(2, 8)
      return prisma.institutionInvite.create({
        data: { institutionId: args.institutionId, role: args.role, expiresAt: args.expiresAt ? new Date(args.expiresAt) : null, code },
      })
    },

    redeemInvite: async (_parent, { code, userId }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionInvite) throw new Error('Prisma not ready for InstitutionInvite')
      const reqLike = { headers: { authorization: ctx?.token ? `Bearer ${ctx.token}` : '' } }
      const user = await resolveUser(reqLike).catch(() => null)
      if (!user?.id || user.id !== userId) throw new Error('FORBIDDEN')
      const invite = await prisma.institutionInvite.findUnique({ where: { code } })
      if (!invite) throw new Error('Invite not found')
      if (invite.expiresAt && invite.expiresAt < new Date()) throw new Error('Invite expired')
      return prisma.institutionMember.upsert({
        where: { institutionId_userId: { institutionId: invite.institutionId, userId } },
        create: { institutionId: invite.institutionId, userId, role: invite.role },
        update: { role: invite.role, status: 'ACTIVE' },
      })
    },
  },
}

function requireAuth(ctx) {
  if (!ctx?.token) throw new Error('Not authenticated')
}

