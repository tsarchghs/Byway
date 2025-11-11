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
    institutions: async ()=>{
      const prisma = await getPrisma()
      if (prisma?.institution) return prisma.institution.findMany({ orderBy: { createdAt: 'desc' } })
      return []
    },
    institutionBySlug: async (_p,{slug})=>{
      const prisma = await getPrisma()
      if (prisma?.institution) return prisma.institution.findUnique({ where: { slug } })
      return null
    },
    classrooms: async (_p,{institutionId})=>{
      const prisma = await getPrisma()
      if (prisma?.classroom) return prisma.classroom.findMany({ where: { institutionId } })
      return []
    }
  },
  Mutation: {
    createInstitution: async (_p,{name, slug})=>{
      const prisma = await getPrisma()
      if (!prisma?.institution) throw new Error('Prisma not ready for Institution')
      return prisma.institution.create({ data: { name, slug } })
    },
    createClassroom: async (_p,{institutionId, name, code})=>{
      const prisma = await getPrisma()
      if (!prisma?.classroom) throw new Error('Prisma not ready for Classroom')
      return prisma.classroom.create({ data: { institutionId, name, code } })
    }
  }
}
