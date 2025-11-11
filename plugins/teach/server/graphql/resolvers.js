// plugins/teach/server/graphql/resolvers.js

export async function getPrisma() {
  try {
    const modA = await import('../db/client.js').catch(() => null)
    if (modA?.prisma) return modA.prisma
    if (modA?.PrismaClient) return new modA.PrismaClient()
  } catch (e) {
    console.warn('[teach] Failed to load ../db/client.js:', e.message)
  }

  try {
    const modB = await import('../db/generated/client/index.js').catch(() => null)
    if (modB?.PrismaClient) return new modB.PrismaClient()
  } catch (e) {
    console.warn('[teach] Failed to load ../db/generated/client/index.js:', e.message)
  }

  console.error('[teach] No usable Prisma client found.')
  return null
}

export const resolvers = {
  Query: {
    teacherCourses: async (_parent, { teacherId }) => {
      const prisma = await getPrisma()
      if (!prisma?.course) return []
      return prisma.course.findMany({ where: { teacherId } })
    },

    courseRoster: async (_parent, { courseId }) => {
      // Cross-plugin communication with students-internal will be handled via SDK
      // For now, return mock data to satisfy frontend expectations
      return []
    },
  },
}
