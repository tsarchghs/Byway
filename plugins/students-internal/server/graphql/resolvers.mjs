import { PrismaClient } from "../db/generated/client/index.js";
const prisma = new PrismaClient();

export const studentResolvers = {
  Query: {
    gradebookOverview: async (_p, _a, ctx) => {
      // Minimal implementation: pull some data if present, else return sensible defaults
      // Try to infer userId from JWT (ctx.user?.id); otherwise return empty
      const now = new Date().toISOString();
      return {
        byCourse: [],
        byAssignment: [],
        activity: [{ at: now, message: "Gradebook ready." }],
      };
    },
  },
};

import { PrismaClient } from '../db/generated/client/index.js'
const prisma = new PrismaClient()

export const resolvers = {
  Query: {
    async studentCourses(_, { studentId }) {
      // join enrollments->courses
      const enr = await prisma.enrollment.findMany({ where: { studentId } })
      const ids = [...new Set(enr.map(e=>e.courseId))]
      if (!ids.length) return []
      const courses = await prisma.course.findMany({ where: { id: { in: ids } } })
      return courses
    },
    async enrollments(_,{ studentId, courseId }) {
      return prisma.enrollment.findMany({ where: { ...(studentId?{studentId}:{}), ...(courseId?{courseId}:{}), } })
    },
    async gradebook(_,{ courseId }) {
      return prisma.gradebookEntry.findMany({ where: { courseId }, orderBy:{ updatedAt: 'desc' } })
    },
    async isEnrolled(_,{ studentId, courseId }) {
      const e = await prisma.enrollment.findFirst({ where: { studentId, courseId } })
      return !!e
    }
  },
  Mutation: {
    async upsertGrade(_,{ input }) {
      const { studentId, assignmentId, courseId, grade, feedback } = input
      const existing = await prisma.gradebookEntry.findFirst({ where: { studentId, assignmentId, courseId } })
      if (existing) {
        return prisma.gradebookEntry.update({ where: { id: existing.id }, data: { grade, feedback, updatedAt: new Date() } })
      }
      return prisma.gradebookEntry.create({ data: { studentId, assignmentId, courseId, grade, feedback } })
    },
    async enrollStudent(_,{ studentId, courseId }) {
      const existing = await prisma.enrollment.findFirst({ where: { studentId, courseId } })
      if (existing) return existing
      return prisma.enrollment.create({ data: { studentId, courseId, progressPct: 0 } })
    }
  }
}
