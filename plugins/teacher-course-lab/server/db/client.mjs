import pkg from './generated/client/index';
const { PrismaClient } = pkg;

let prisma;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

const defaultClient = getPrisma();
export default defaultClient;
