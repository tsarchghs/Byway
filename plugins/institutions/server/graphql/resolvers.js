// plugins/institutions/server/graphql/resolvers.js

async function getPrisma() {
  // Try the primary client (custom output)
  try {
    const mod = await import('../db/client.js').catch(() => null)
    if (mod?.prisma) return mod.prisma
    if (mod?.PrismaClient) return new mod.PrismaClient()
  } catch (e) {
    console.warn('[institutions] Failed to load ../db/client.js:', e.message)
  }

  // Try the generated fallback (standard Prisma output)
  try {
    const mod = await import('../db/generated/client/index.js').catch(() => null)
    if (mod?.PrismaClient) return new mod.PrismaClient()
  } catch (e) {
    console.warn('[institutions] Failed to load ../db/generated/client/index.js:', e.message)
  }

  console.error('[institutions] No usable Prisma client found.')
  return null
}

export const resolvers = {
  Query: {
    institutions: async () => {
      const prisma = await getPrisma()
      if (!prisma?.institution) return []
      return prisma.institution.findMany({ orderBy: { createdAt: 'desc' } })
    },

    institutionBySlug: async (_parent, { slug }) => {
      const prisma = await getPrisma()
      if (!prisma?.institution) return null
      return prisma.institution.findUnique({ where: { slug } })
    },

    classrooms: async (_parent, { institutionId }) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) return []
      return prisma.classroom.findMany({ where: { institutionId } })
    },
  },

  Mutation: {
    createInstitution: async (_parent, { name, slug }) => {
      const prisma = await getPrisma()
      if (!prisma?.institution) throw new Error('Prisma not ready for Institution')
      return prisma.institution.create({
        data: { name, slug },
      })
    },

    createClassroom: async (_parent, { institutionId, name, code }) => {
      const prisma = await getPrisma()
      if (!prisma?.classroom) throw new Error('Prisma not ready for Classroom')
      return prisma.classroom.create({
        data: { institutionId, name, code },
      })
    },
  },
}
