// teach overlay resolvers
async function getPrisma() {
  try {
    const mod = await import('../db/generated/index.js')
    return new mod.PrismaClient()
  } catch {
    try {
      const mod = await import('../db/client.js')
      return mod.prisma
    } catch {
      return null
    }
  }
}

const resolversOverlay = {
  Query: {
    teacherOverview: async () => {
      const prisma = await getPrisma()
      const result = {
        metrics: { students: 0, courses: 0, pending: 0 },
        courses: [], assignments: []
      }
      if (prisma?.course) {
        const courses = await prisma.course.findMany({ include: { _count: { select: { enrollments: true } } } }).catch(()=>[])
        result.courses = courses.map(c=>({ id: c.id, title: c.title, published: !!c.published, enrolled: c._count?.enrollments || 0 }))
        result.metrics.courses = result.courses.length
        const allEnrolls = result.courses.reduce((a,c)=> a + (c.enrolled || 0), 0)
        result.metrics.students = allEnrolls
      }
      if (prisma?.assignment) {
        const assigns = await prisma.assignment.findMany({ include: { submissions: true, course: true } }).catch(()=>[])
        result.assignments = assigns.map(a=>({ 
          id: a.id, title: a.title, courseTitle: a.course?.title || '', 
          submissions: (a.submissions||[]).length,
          pending: (a.submissions||[]).filter(s=>s.status!=='GRADED').length
        }))
        result.metrics.pending = result.assignments.reduce((acc, a)=> acc + a.pending, 0)
      }
      return result
    }
  }
}

export default resolversOverlay
