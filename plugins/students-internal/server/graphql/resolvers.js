import { prisma } from '../db/client.js';

export const resolvers = {
  Query: {
    async studentCourses(_, { studentId }) {
      const enrolls = await prisma.enrollment.findMany({ where: { studentId }, select: { courseId: true } });
      const ids = [...new Set(enrolls.map(e => e.courseId))];
      const courses = await prisma.course.findMany({ where: { id: { in: ids } } });
      return courses;
    },
    async enrollments(_, args) {
      const where = {};
      if (args.studentId) where.studentId = args.studentId;
      if (args.courseId) where.courseId = args.courseId;
      return prisma.enrollment.findMany({ where, orderBy: { updatedAt: 'desc' } });
    },
    async courseGradebook(_, { courseId }) {
      return prisma.gradebookEntry.findMany({ where: { courseId }, orderBy: { updatedAt: 'desc' } });
    },
    async isEnrolled(_, { studentId, courseId }) {
      const x = await prisma.enrollment.findFirst({ where: { studentId, courseId } });
      return !!x;
    },
    async kvGet(_, { key }) {
      const row = await prisma.kv.findUnique({ where: { key } });
      return { key, value: row?.value ?? null };
    }
  },
  Mutation: {
    async enrollStudent(_, { studentId, courseId }) {
      // idempotent create
      const existing = await prisma.enrollment.findFirst({ where: { studentId, courseId } });
      if (existing) return existing;
      return prisma.enrollment.create({ data: { studentId, courseId, progressPct: 0 } });
    },
    async upsertGrade(_, { input }) {
      const { assignmentId, studentId, courseId, grade, feedback } = input;
      const existing = await prisma.gradebookEntry.findFirst({ where: { assignmentId, studentId, courseId } });
      if (existing) {
        return prisma.gradebookEntry.update({ where: { id: existing.id }, data: { grade, feedback } });
      }
      return prisma.gradebookEntry.create({ data: { assignmentId, studentId, courseId, grade, feedback } });
    },
    async kvSet(_, { key, value }) {
      const up = await prisma.kv.upsert({
        where: { key },
        update: { value: value ?? null },
        create: { key, value: value ?? null }
      });
      return { key: up.key, value: up.value };
    },
    async kvDelete(_, { key }) {
      try {
        await prisma.kv.delete({ where: { key } });
        return true;
      } catch {
        return false;
      }
    }
  }
};
