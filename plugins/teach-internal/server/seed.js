// /plugins/teach-internal/server/seed.js
const { PrismaClient } = await import('./db/generated/client/index.js');
const prisma = new PrismaClient();

async function main() {
  const teacherId = "cmhuxaplq0003uc33pbucqk3y"; // teacher user ID
  console.log("👨‍🏫 Seeding demo content for teacher:", teacherId);

  // 💣 Clean previous demo
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.classroom.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.course.deleteMany({});

  // 1️⃣ Course
  const course = await prisma.course.create({
    data: {
      id: "cmhuxn00u0000uck79f1aegir", // stable for route building
      title: "Full Stack Foundations",
      category: "Software",
      difficulty: "Intermediate",
      description: "Learn modern web development from fundamentals to deployment.",
      teacherId,
      price: 0,
      discount: 0,
    },
  });
  console.log("✅ Course:", course.id);

  // 2️⃣ Module
  const module = await prisma.module.create({
    data: {
      id: "mod-1", // stable ID used in your route
      title: "Introduction to Web Development",
      courseId: course.id,
    },
  });
  console.log("✅ Module:", module.id);

  // 3️⃣ Lessons
  const lessonData = [
    {
      id: "lesson-html",
      title: "HTML Basics",
      moduleId: module.id,
      type: "video",
      duration: 10,
      content: "Learn about tags, elements, and page structure.",
      videoUrl: "https://example.com/html-intro.mp4",
      preview: true,
      position: 1,
    },
    {
      id: "lesson-css",
      title: "CSS Fundamentals",
      moduleId: module.id,
      type: "video",
      duration: 12,
      content: "Master colors, layouts, and typography.",
      videoUrl: "https://example.com/css-fundamentals.mp4",
      preview: false,
      position: 2,
    },
    {
      id: "lesson-js",
      title: "JavaScript Basics",
      moduleId: module.id,
      type: "video",
      duration: 14,
      content: "Understand variables, functions, and the DOM.",
      videoUrl: "https://example.com/js-intro.mp4",
      preview: false,
      position: 3,
    },
  ];

  await prisma.lesson.createMany({ data: lessonData });
  console.log(`✅ ${lessonData.length} lessons created`);

  // 4️⃣ Classroom
  const classroom = await prisma.classroom.create({
    data: {
      courseId: course.id,
      name: "Winter 2025 Cohort",
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("✅ Classroom:", classroom.id);

  // 5️⃣ Assignment
  const assignment = await prisma.assignment.create({
    data: {
      classroomId: classroom.id,
      title: "Mini Website Project",
      description: "Build a simple responsive landing page using HTML and CSS.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("✅ Assignment:", assignment.id);

  console.log("\n🎓 Final structure:");
  console.log({
    teacherId,
    courseId: course.id,
    moduleId: module.id,
    classroomId: classroom.id,
    assignmentId: assignment.id,
  });

  console.log(
    `\n🌐 Open in browser:\nhttp://localhost:3000/student/${teacherId}/course/${course.id}/module/${module.id}\n`
  );
}

main()
  .then(() => console.log("✅ Seeding complete"))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
