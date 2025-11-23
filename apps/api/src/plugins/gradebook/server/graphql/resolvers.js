// Gradebook GraphQL resolvers
import { getPrisma } from '../db/client.js';

function computePercentage(entry) {
  if (entry.score == null || entry.maxScore == null || entry.maxScore === 0) {
    return null;
  }
  return (entry.score / entry.maxScore) * 100;
}

export const resolvers = {
  Query: {
    async gradebookByStudent(_, { studentId }) {
      const prisma = getPrisma();
      return prisma.gradebookEntry.findMany({
        where: { studentId },
        orderBy: { updatedAt: 'desc' },
      });
    },
    async gradebookByCourse(_, { courseId }) {
      const prisma = getPrisma();
      return prisma.gradebookEntry.findMany({
        where: { courseId },
        orderBy: [
          { courseTitle: 'asc' },
          { studentDisplayName: 'asc' },
          { updatedAt: 'desc' }
        ],
      });
    },
    async gradebookEntry(_, { id }) {
      const prisma = getPrisma();
      return prisma.gradebookEntry.findUnique({ where: { id } });
    },
  },

  Mutation: {
    async upsertGradebookEntry(_, { input }) {
      const prisma = getPrisma();
      const { id, ...rest } = input;
      const data = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined)
      );

      if (id) {
        return prisma.gradebookEntry.update({
          where: { id },
          data,
        });
      }

      return prisma.gradebookEntry.create({
        data,
      });
    },

    async deleteGradebookEntry(_, { id }) {
      const prisma = getPrisma();
      await prisma.gradebookEntry.delete({ where: { id } });
      return true;
    },
  },

  GradebookEntry: {
    percentage(entry) {
      return computePercentage(entry);
    },
  },
};
