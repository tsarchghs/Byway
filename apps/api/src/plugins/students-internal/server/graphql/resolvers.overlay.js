// students-internal overlay resolvers
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
    gradebookOverview: async (_r, _a, _ctx) => {
      const prisma = await getPrisma()
      const result = {
        metrics: { avgGrade: null, completed: 0, outstanding: 0 },
        courses: [], modules: [], assignments: []
      }
      if (prisma?.enrollment && prisma?.gradeItem) {
        const ens = await prisma.enrollment.findMany({ include: { course: true } }).catch(()=>[])
        const items = await prisma.gradeItem.findMany().catch(()=>[])
        const byEn = new Map()
        for (const it of items) {
          const arr = byEn.get(it.enrollmentId) || []
          arr.push(it)
          byEn.set(it.enrollmentId, arr)
        }
        // Aggregate courses
        const byCourse = new Map()
        for (const e of ens) {
          const key = e.courseId
          const row = byCourse.get(key) || { id: key, title: e.course?.title || key, total: 0, completed: 0, grades: [] }
          row.total += 1
          const grades = byEn.get(e.id) || []
          if (grades.some(g=>g.status==='GRADED')) row.completed += 1
          const avg = grades.length ? grades.reduce((a,b)=>a+(b.score||0),0)/grades.length : null
          if (avg!=null) row.grades.push(avg)
          byCourse.set(key, row)
        }
        result.courses = Array.from(byCourse.values()).map(r=>({ ...r, grade: r.grades.length ? r.grades.reduce((a,b)=>a+b,0)/r.grades.length : null }))
        // Modules (placeholder from courses)
        result.modules = result.courses.map(c=>({ id: c.id, title: c.title, lessons: c.total, grade: c.grade }))
        // Assignments (flatten graded items)
        result.assignments = items.map(it=>({ id: it.id, title: it.label || ('Item '+it.id), courseTitle: it.courseTitle || '', score: it.score || null, status: it.status || 'PENDING' }))
        // Metrics
        const allScores = items.filter(i=>i.status==='GRADED' && typeof i.score==='number').map(i=>i.score)
        result.metrics.avgGrade = allScores.length ? allScores.reduce((a,b)=>a+b,0)/allScores.length : null
        result.metrics.completed = items.filter(i=>i.status==='GRADED').length
        result.metrics.outstanding = items.filter(i=>i.status!=='GRADED').length
        return result
      }
      return result
    }
  }
}

export default resolversOverlay
