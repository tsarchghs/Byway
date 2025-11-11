import { GraphQLScalarType, Kind } from 'graphql'
import { PrismaClient } from '../db/generated/index'

const prisma = new PrismaClient()

const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'Arbitrary JSON',
  parseValue: (v) => v,
  serialize: (v) => v,
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING: return ast.value
      case Kind.INT: return parseInt(ast.value, 10)
      case Kind.FLOAT: return parseFloat(ast.value)
      case Kind.BOOLEAN: return ast.value === 'true'
      default: return null
    }
  }
})

export const resolvers = {
  JSON: JSONScalar,
Query: {
  async kvGet(_, { key }) {
    const row = await prisma.kV.findUnique({ where: { key } });
    return row ? { key: row.key, value: row.value ?? null } : null;
  },
  async isEnrolled(_, { studentId, courseId }) {
    const e = await prisma.enrollment.findFirst({ where: { studentId, courseId } });
    return !!e;
  },
  async enrollments(_, args) {
    return prisma.enrollment.findMany({ where: { ...args } });
  },
  async courseGradebook(_, { courseId }) {
    return prisma.gradebookEntry.findMany({
      where: { courseId },
      orderBy: { updatedAt: "desc" },
    });
  },

  // 🧩 Add myProgress here
  async myProgress(_, args, ctx) {
    if (!ctx.user?.id) throw new Error("Not authenticated");
    const filters = { studentId: ctx.user.id };
    if (args.courseId) filters.courseId = args.courseId;
    if (args.moduleId) filters.moduleId = args.moduleId;
    if (args.lessonId) filters.lessonId = args.lessonId;

    return prisma.studentProgress.findMany({
      where: filters,
      orderBy: { updatedAt: "desc" },
    });
  },
},

  Mutation: {
    async kvSet(_, { key, value }) {
      const row = await prisma.kV.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
      return { key: row.key, value: row.value ?? null }
    },
    async kvDelete(_, { key }) {
      try {
        await prisma.kV.delete({ where: { key } })
        return true
      } catch {
        return false
      }
    },
    async enrollStudent(_, { studentId, courseId }) {
      const existing = await prisma.enrollment.findFirst({ where: { studentId, courseId } })
      if (existing) return existing
      return prisma.enrollment.create({ data: { studentId, courseId, progressPct: 0 } })
    },
    async upsertGrade(_, { input }) {
      if (input.id) {
        return prisma.gradebookEntry.update({
          where: { id: input.id },
          data: { assignmentId: input.assignmentId, studentId: input.studentId, courseId: input.courseId, grade: input.grade, feedback: input.feedback }
        })
      }
      return prisma.gradebookEntry.create({ data: input })
    },
    async setProgress(_, { enrollmentId, progressPct }) {
      return prisma.enrollment.update({ where: { id: enrollmentId }, data: { progressPct } })
    }
  }
}
