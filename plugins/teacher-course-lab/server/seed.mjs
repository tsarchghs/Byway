// Sample seed script (run manually)
//   node plugins/teacher-course-lab/server/seed.mjs
import pkg from './db/generated/client/index.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  await prisma.labChallenge.create({
    data: {
      title: 'FizzBuzz in JS',
      slug: 'fizzbuzz-js',
      description: 'Print numbers 1..100; multiples of 3 -> Fizz, 5 -> Buzz.',
      difficulty: 'Beginner',
      starterRepoUrl: 'https://github.com/example/fizzbuzz-starter',
      testsRepoUrl: 'https://github.com/example/fizzbuzz-tests',
      runtime: 'node18',
      visibility: 'public',
      createdByUserId: 'teacher-demo'
    }
  });
  console.log('Seeded: FizzBuzz challenge');
}

main().finally(() => prisma.$disconnect());
