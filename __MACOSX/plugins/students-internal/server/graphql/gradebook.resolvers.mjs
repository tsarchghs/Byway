export const gradebookResolvers = {
  Query: {
    gradebook: async (_root, { studentId }, ctx) => {
      const sid = studentId || (ctx?.user?.id || ctx?.user?.sub || 's1')
      // Return minimal real data if your Prisma is ready; otherwise mocked rows
      return [
        { id: 'r1', courseId: 'c1', courseTitle: 'Algorithms I', studentId: sid, studentName: 'You', score: 92.5, status: 'graded', updatedAt: new Date().toISOString() },
        { id: 'r2', courseId: 'c2', courseTitle: 'Databases',    studentId: sid, studentName: 'You', score: 85.0, status: 'submitted', updatedAt: new Date().toISOString() },
      ]
    },
    gradebookOverview: async (_root, { studentId }, ctx) => {
      // Minimal computed overview to feed cards
      return { totalCourses: 5, totalAssignments: 18, submitted: 14, pending: 3, graded: 12 }
    }
  }
}
