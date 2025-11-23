import { GraphQLScalarType, Kind } from 'graphql'
import { PrismaClient } from '../db/generated/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.STUDENTS_DATABASE_URL ?? process.env.DATABASE_URL ?? 'mysql://root:gjergji21@localhost:3306/byway_students'
    }
  }
})

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
  async studentByUserId(_, { userId }) {
    if (!userId) return null
    return prisma.student.findUnique({ where: { userId } }).catch(() => null)
  },
  async myCourses(_, { studentId }, ctx) {
    return prisma.studentCourse.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    })
  },
  async isEnrolled(_, { studentId, courseId }) {
    const e = await prisma.studentCourse.findFirst({ where: { studentId, courseId } });
    return !!e;
  },
  async enrollments(_, args) {
    return prisma.studentCourse.findMany({ where: { ...args } });
  },
  async courseGradebook(_, { courseId }) {
    return prisma.gradebookEntry.findMany({
      where: { courseId },
      orderBy: { updatedAt: "desc" },
    });
  },

  async lessonShares(_, { courseId, moduleId, lessonId }) {
    const where = {
      ...(courseId ? { courseId } : {}),
      ...(moduleId ? { moduleId } : {}),
      ...(lessonId ? { lessonId } : {}),
    };
    return prisma.lessonShare.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  // 🧩 Add myProgress here
async myProgress(_, { studentId }) {
  const filters = { studentId };
  return prisma.studentProgress.findMany({
    where: filters,
    orderBy: { updatedAt: "desc" },
  });
},

  async studentExists(_, { studentId }) {
    const s = await prisma.student.findUnique({ where: { id: studentId } }).catch(() => null)
    return !!s
  }
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
      const existing = await prisma.studentCourse.findFirst({ where: { studentId, courseId } })
      if (existing) return existing

      // Ensure a Course row exists to satisfy FK; create minimal stub if missing
      const course = await prisma.course.findUnique({ where: { id: courseId } })
      if (!course) {
        await prisma.course.create({
          data: {
            id: courseId,
            title: 'Course',
            description: '',
            progressPct: 0,
          },
        })
      }

      return prisma.studentCourse.create({ data: { studentId, courseId, progress: 0 } })
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
      return prisma.studentCourse.update({ where: { id: enrollmentId }, data: { progress: progressPct } });
    },
    async upsertLessonShare(_, { input }) {
      const { id, ...data } = input;
      if (id) {
        return prisma.lessonShare.update({
          where: { id },
          data,
        });
      }
      return prisma.lessonShare.create({ data });
    },
    async deleteLessonShare(_, { id }) {
      try {
        await prisma.lessonShare.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },
    async createStudent(_, { userId, displayName }) {
      if (!userId) throw new Error('userId is required');
      const existing = await prisma.student.findUnique({ where: { userId } }).catch(() => null);
      if (existing) return existing;
      return prisma.student.create({ data: { userId, displayName } });
    },
  },
}
