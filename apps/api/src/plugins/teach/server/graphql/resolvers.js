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

    teacherProfile: async (_parent, { id }) => {
      const prisma = await getPrisma()
      if (!prisma?.teacherProfile) return null
      return prisma.teacherProfile.findUnique({ where: { id } })
    },
  },

  Mutation: {
    createCourse: async (_parent, { title, code, teacherId }) => {
      const prisma = await getPrisma()
      if (!prisma?.course) throw new Error('Prisma not ready for course')
      return prisma.course.create({ data: { title, code, teacherId } })
    },

    updateCourse: async (_parent, { id, title, code }) => {
      const prisma = await getPrisma()
      if (!prisma?.course) throw new Error('Prisma not ready for course')
      return prisma.course.update({
        where: { id },
        data: { ...(title ? { title } : {}), ...(code ? { code } : {}) },
      })
    },

    assignTeacher: async (_parent, { courseId, teacherId }) => {
      const prisma = await getPrisma()
      if (!prisma?.course) throw new Error('Prisma not ready for course')
      return prisma.course.update({
        where: { id: courseId },
        data: { teacherId },
      })
    },

    createTeacherProfile: async (_parent, { bio, subjects, avatarUrl, payoutEmail }, ctx) => {
      const prisma = await getPrisma()
      if (!prisma?.teacherProfile) throw new Error('Prisma not ready for teacherProfile')
      const profile = await prisma.teacherProfile.create({
        data: {
          bio,
          subjects: subjects ?? 'General',
          ...(avatarUrl ? { avatarUrl } : {}),
          ...(payoutEmail ? { payoutEmail } : {}),
        },
      })

      // Try to link the teacher profile back to the authenticated user in the authentication service
      const authToken = ctx?.req?.headers?.authorization || ctx?.req?.headers?.Authorization
      if (authToken) {
        const mutation = `mutation($teacherProfileId:String!){
          updateUserTeacherProfile(teacherProfileId:$teacherProfileId){ id teacherProfileId }
          setMyRole(role:"teacher")
        }`
        try {
          await fetch(`${process.env.API_BASE || 'http://localhost:4000'}/api/authentication/graphql`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', Authorization: authToken },
            body: JSON.stringify({ query: mutation, variables: { teacherProfileId: profile.id } }),
          })
        } catch (e) {
          console.warn('[teach] Failed to link teacher profile to auth user:', e?.message || e)
        }
      }

      return profile
    },
  },
}
