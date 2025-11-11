async function getPrisma() {
  try {
    const modA = await import('../db/client.js').catch(()=>null)
    if (modA && modA.prisma) return modA.prisma
  } catch {}
  try {
    const modB = await import('../db/generated/client/index.js').catch(()=>null)
    if (modB && modB.PrismaClient) {
      const prisma = new modB.PrismaClient()
      return prisma
    }
  } catch {}
  return null
}
export default {
  Query: {
    teacherCourses: async (_p,{teacherId})=>{
      const prisma = await getPrisma()
      if (prisma?.course) return prisma.course.findMany({ where: { teacherId } })
      return []
    },
    courseRoster: async (_p,{courseId})=>{
      // pull from students-internal enrollment if available
      // We cannot cross-import prisma, so just return shape (frontend expects array)
      return []
    }
  }
}
