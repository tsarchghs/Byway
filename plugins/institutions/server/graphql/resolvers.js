// plugins/institutions/server/graphql/resolvers.js
import { PrismaClient } from '../db/generated/index'
const prismaSingleton = new PrismaClient()
async function getPrisma() {
  return prismaSingleton
}

export const resolvers = {
  Query: {
    institutions: async () => {
      const prisma = await getPrisma()
      if (!prisma?.institution) return []
      return prisma.institution.findMany({
        orderBy: { createdAt: 'desc' },
        include: { departments: true, classrooms: true, members: true },
      })
    },

    institution: async (_parent, { id }) => {
      const prisma = await getPrisma()
      if (!prisma?.institution) return null
      return prisma.institution.findUnique({ where: { id }, include: { departments: true, classrooms: true, members: true } })
    },

    institutionBySlug: async (_parent, { slug }) => {
      const prisma = await getPrisma()
      if (!prisma?.institution) return null
      return prisma.institution.findUnique({ where: { slug }, include: { departments: true, classrooms: true, members: true } })
    },

    departments: async (_parent, { institutionId }) => {
      const prisma = await getPrisma()
      if (!prisma?.department) return []
      return prisma.department.findMany({ where: { institutionId }, orderBy: { createdAt: 'desc' } })
    },

    classrooms: async (_parent, { institutionId, departmentId }) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) return []
      return prisma.classroom.findMany({
        where: { ...(institutionId ? { institutionId } : {}), ...(departmentId ? { departmentId } : {}) },
        orderBy: { createdAt: 'desc' },
        include: { enrollments: true },
      })
    },

    members: async (_parent, { institutionId, role }) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) return []
      return prisma.institutionMember.findMany({
        where: { institutionId, ...(role ? { role } : {}) },
        orderBy: { createdAt: 'desc' },
      })
    },

    stats: async (_parent, { institutionId }) => {
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
    createInstitution: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institution) throw new Error('Prisma not ready for Institution')
      requireAuth(ctx)
      return prisma.institution.create({ data: args })
    },

    updateInstitution: async (_parent, { id, ...data }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institution) throw new Error('Prisma not ready for Institution')
      requireAuth(ctx)
      return prisma.institution.update({ where: { id }, data })
    },

    createDepartment: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.department) throw new Error('Prisma not ready for Department')
      requireAuth(ctx)
      return prisma.department.create({ data: args })
    },

    updateDepartment: async (_parent, { id, ...data }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.department) throw new Error('Prisma not ready for Department')
      requireAuth(ctx)
      return prisma.department.update({ where: { id }, data })
    },

    createClassroom: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) throw new Error('Prisma not ready for Classroom')
      requireAuth(ctx)
      const { name, ...rest } = args
      const title = args.title || name
      return prisma.classroom.create({ data: { ...rest, title } })
    },

    updateClassroom: async (_parent, { id, ...data }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) throw new Error('Prisma not ready for Classroom')
      requireAuth(ctx)
      const { name, title, ...rest } = data
      const next = { ...rest }
      if (title || name) next.title = title || name
      return prisma.classroom.update({ where: { id }, data: next })
    },

    addMember: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) throw new Error('Prisma not ready for InstitutionMember')
      requireAuth(ctx)
      return prisma.institutionMember.upsert({
        where: { institutionId_userId: { institutionId: args.institutionId, userId: args.userId } },
        create: args,
        update: { role: args.role, status: args.status || 'ACTIVE' },
      })
    },

    removeMember: async (_parent, { id }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) throw new Error('Prisma not ready for InstitutionMember')
      requireAuth(ctx)
      await prisma.institutionMember.delete({ where: { id } })
      return true
    },

    updateMemberRole: async (_parent, { id, role, status }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionMember) throw new Error('Prisma not ready for InstitutionMember')
      requireAuth(ctx)
      return prisma.institutionMember.update({ where: { id }, data: { role, ...(status ? { status } : {}) } })
    },

    createInvite: async (_parent, args, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionInvite) throw new Error('Prisma not ready for InstitutionInvite')
      requireAuth(ctx)
      const code = Math.random().toString(36).slice(2, 8)
      return prisma.institutionInvite.create({
        data: { institutionId: args.institutionId, role: args.role, expiresAt: args.expiresAt ? new Date(args.expiresAt) : null, code },
      })
    },

    redeemInvite: async (_parent, { code, userId }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.institutionInvite) throw new Error('Prisma not ready for InstitutionInvite')
      requireAuth(ctx)
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

export { getPrisma }
