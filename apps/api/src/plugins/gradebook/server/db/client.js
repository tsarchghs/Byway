import pkg from './generated/client/index.js';
const { PrismaClient } = pkg;

let prisma = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}
