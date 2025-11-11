import { PrismaClient } from "../db/generated/client/index.js";
const prisma = new PrismaClient();

export const teachResolvers = {
  Query: {
    teacherOverview: async () => {
      const now = new Date().toISOString();
      return {
        courses: [],
        assignments: [],
        signals: [{ at: now, message: "Dashboard ready." }],
      };
    },
  },
};
