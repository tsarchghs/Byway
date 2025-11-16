// /plugins/teach-internal/server/seed.js
const { PrismaClient } = await import('./db/generated/client/index.js');
const prisma = new PrismaClient();

// Import teacher-course-lab Prisma client
let labPrisma = null;
try {
  const labPrismaModule = await import('../../teacher-course-lab/server/db/client.mjs');
  labPrisma = labPrismaModule.default;
  console.log('✅ Connected to teacher-course-lab database');
} catch (e) {
  console.warn('⚠️ Could not connect to teacher-course-lab database:', e.message);
  console.warn('   Lab challenges will not be created. Make sure teacher-course-lab plugin is set up.');
}

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
  const module2 = await prisma.module.create({
    data: {
      id: "mod-2", // stable ID used in your route
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
      moduleId: module2.id,
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
    // 🔬 Lab: Build a REST API with Express
    {
      id: "lab-rest-api",
      title: "Build a REST API",
      moduleId: module.id,
      type: "lab",
      duration: 60,
      content: "Create a RESTful API with Express.js. Implement CRUD operations for a todo list application.",
      preview: false,
      position: 4,
      metadata: JSON.stringify({
        lab: {
          kind: "BACKEND_NODE",
          dockerImage: "node:22-alpine",
          buildCmd: "npm install",
          startCmd: "npm start",
          devPort: 3000,
          apiTests: [
            {
              id: "test-health",
              name: "Health Check Endpoint",
              method: "GET",
              path: "/api/health",
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ status: "ok" }),
              points: 10
            },
            {
              id: "test-get-todos",
              name: "Get All Todos",
              method: "GET",
              path: "/api/todos",
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify([]),
              points: 15
            },
            {
              id: "test-create-todo",
              name: "Create New Todo",
              method: "POST",
              path: "/api/todos",
              headers: [{ key: "Content-Type", value: "application/json" }],
              bodyJson: JSON.stringify({ title: "Test Todo", completed: false }),
              expectedStatus: 201,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ title: "Test Todo", completed: false }),
              points: 20
            },
            {
              id: "test-get-todo-by-id",
              name: "Get Todo by ID",
              method: "GET",
              path: "/api/todos/:id",
              pathParams: [{ key: "id", value: "1" }],
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ id: "1" }),
              points: 15
            },
            {
              id: "test-update-todo",
              name: "Update Todo",
              method: "PUT",
              path: "/api/todos/:id",
              pathParams: [{ key: "id", value: "1" }],
              headers: [{ key: "Content-Type", value: "application/json" }],
              bodyJson: JSON.stringify({ title: "Updated Todo", completed: true }),
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ title: "Updated Todo", completed: true }),
              points: 20
            },
            {
              id: "test-delete-todo",
              name: "Delete Todo",
              method: "DELETE",
              path: "/api/todos/:id",
              pathParams: [{ key: "id", value: "1" }],
              expectedStatus: 204,
              points: 20
            }
          ]
        }
      }),
    },
    // 🔬 Lab: Build a Todo App Frontend with Nuxt
    {
      id: "lab-nuxt-todo",
      title: "Todo App with Nuxt",
      moduleId: module2.id,
      type: "lab",
      duration: 90,
      content: "Build a complete todo application frontend using Nuxt.js. Implement reactive state management and component composition.",
      preview: false,
      position: 5,
      metadata: JSON.stringify({
        lab: {
          kind: "FRONTEND_NUXT",
          dockerImage: "node:22-alpine",
          buildCmd: "npm install",
          startCmd: "npm run dev",
          devPort: 3000,
          uiTests: [
            {
              id: "test-homepage",
              name: "Homepage Renders",
              path: "/",
              expectTextLine: "Todo, Welcome, App",
              points: 15
            },
            {
              id: "test-todo-list",
              name: "Todo List Displayed",
              path: "/",
              expectTextLine: "Add Todo, Complete, Delete",
              points: 25
            },
            {
              id: "test-add-todo-form",
              name: "Add Todo Form Exists",
              path: "/",
              expectTextLine: "input, button, submit, Add",
              points: 20
            },
            {
              id: "test-todo-item",
              name: "Todo Items Render",
              path: "/",
              expectTextLine: "checkbox, text, remove",
              points: 20
            },
            {
              id: "test-responsive",
              name: "Responsive Design",
              path: "/",
              expectTextLine: "container, flex, grid",
              points: 20
            }
          ]
        }
      }),
    },
    // 🔬 Lab: Authentication API
    {
      id: "lab-auth-api",
      title: "Authentication API",
      moduleId: module.id,
      type: "lab",
      duration: 75,
      content: "Implement JWT-based authentication with registration, login, and protected routes.",
      preview: false,
      position: 6,
      metadata: JSON.stringify({
        lab: {
          kind: "BACKEND_NODE",
          dockerImage: "node:22-alpine",
          buildCmd: "npm install",
          startCmd: "npm start",
          devPort: 3000,
          apiTests: [
            {
              id: "test-register",
              name: "User Registration",
              method: "POST",
              path: "/api/auth/register",
              headers: [{ key: "Content-Type", value: "application/json" }],
              bodyJson: JSON.stringify({ 
                email: "test@example.com", 
                password: "password123" 
              }),
              expectedStatus: 201,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                user: { email: "test@example.com" },
                token: ""
              }),
              points: 25
            },
            {
              id: "test-login",
              name: "User Login",
              method: "POST",
              path: "/api/auth/login",
              headers: [{ key: "Content-Type", value: "application/json" }],
              bodyJson: JSON.stringify({ 
                email: "test@example.com", 
                password: "password123" 
              }),
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                user: { email: "test@example.com" },
                token: ""
              }),
              points: 25
            },
            {
              id: "test-protected-route",
              name: "Protected Route Access",
              method: "GET",
              path: "/api/profile",
              auth: { type: "bearer", token: "MOCK_TOKEN_FOR_TESTING" },
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                user: { email: "" }
              }),
              points: 25
            },
            {
              id: "test-unauthorized",
              name: "Unauthorized Access",
              method: "GET",
              path: "/api/profile",
              expectedStatus: 401,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                error: "Unauthorized"
              }),
              points: 25
            }
          ]
        }
      }),
    },
    // 🔬 Lab: E-commerce Product Catalog
    {
      id: "lab-product-catalog",
      title: "Product Catalog Frontend",
      moduleId: module2.id,
      type: "lab",
      duration: 120,
      content: "Build a product catalog with search, filtering, and pagination using Nuxt.js and Vue composition API.",
      preview: false,
      position: 7,
      metadata: JSON.stringify({
        lab: {
          kind: "FRONTEND_NUXT",
          dockerImage: "node:22-alpine",
          buildCmd: "npm install",
          startCmd: "npm run dev",
          devPort: 3000,
          uiTests: [
            {
              id: "test-product-list",
              name: "Product List Page",
              path: "/products",
              expectTextLine: "Products, Catalog, Items",
              points: 20
            },
            {
              id: "test-product-card",
              name: "Product Cards Display",
              path: "/products",
              expectTextLine: "image, title, price, description",
              points: 25
            },
            {
              id: "test-search",
              name: "Search Functionality",
              path: "/products",
              expectTextLine: "search, input, filter",
              points: 20
            },
            {
              id: "test-filter",
              name: "Filter Controls",
              path: "/products",
              expectTextLine: "category, price, sort",
              points: 20
            },
            {
              id: "test-pagination",
              name: "Pagination Controls",
              path: "/products",
              expectTextLine: "page, next, previous, pagination",
              points: 15
            }
          ]
        }
      }),
    },
    // 🔬 Lab: CRUD API with Database
    {
      id: "lab-crud-db",
      title: "CRUD API with Database",
      moduleId: module.id,
      type: "lab",
      duration: 90,
      content: "Build a complete CRUD API with SQLite database integration. Implement proper error handling and validation.",
      preview: false,
      position: 8,
      metadata: JSON.stringify({
        lab: {
          kind: "BACKEND_NODE",
          dockerImage: "node:22-alpine",
          buildCmd: "npm install",
          startCmd: "npm start",
          devPort: 3000,
          apiTests: [
            {
              id: "test-create-post",
              name: "Create Blog Post",
              method: "POST",
              path: "/api/posts",
              headers: [{ key: "Content-Type", value: "application/json" }],
              bodyJson: JSON.stringify({ 
                title: "Test Post", 
                content: "Test content",
                author: "Test Author"
              }),
              expectedStatus: 201,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                title: "Test Post",
                content: "Test content",
                author: "Test Author"
              }),
              points: 20
            },
            {
              id: "test-list-posts",
              name: "List All Posts",
              method: "GET",
              path: "/api/posts",
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify([]),
              points: 15
            },
            {
              id: "test-get-post",
              name: "Get Single Post",
              method: "GET",
              path: "/api/posts/:id",
              pathParams: [{ key: "id", value: "1" }],
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                id: "1",
                title: "",
                content: ""
              }),
              points: 15
            },
            {
              id: "test-update-post",
              name: "Update Post",
              method: "PUT",
              path: "/api/posts/:id",
              pathParams: [{ key: "id", value: "1" }],
              headers: [{ key: "Content-Type", value: "application/json" }],
              bodyJson: JSON.stringify({ 
                title: "Updated Post",
                content: "Updated content"
              }),
              expectedStatus: 200,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                title: "Updated Post",
                content: "Updated content"
              }),
              points: 20
            },
            {
              id: "test-delete-post",
              name: "Delete Post",
              method: "DELETE",
              path: "/api/posts/:id",
              pathParams: [{ key: "id", value: "1" }],
              expectedStatus: 204,
              points: 15
            },
            {
              id: "test-404",
              name: "404 Not Found",
              method: "GET",
              path: "/api/posts/999",
              expectedStatus: 404,
              expectMode: "json-subset",
              expectJsonStr: JSON.stringify({ 
                error: "Not found"
              }),
              points: 15
            }
          ]
        }
      }),
    }
  ];

  await prisma.lesson.createMany({ data: lessonData });
  const createdLessons = await prisma.lesson.findMany({
    where: { moduleId: { in: [module.id, module2.id] } },
    orderBy: { position: 'asc' }
  });
  console.log(`✅ ${lessonData.length} lessons created (${lessonData.filter(l => l.type === 'lab').length} labs)`);

  // 3.5️⃣ Create Lab Challenges (simulate teacher setup)
  const labChallengesCreated = [];
  if (labPrisma) {
    console.log("\n🔬 Setting up lab challenges...");
    
    // Clean existing lab challenges for these lessons
    const labLessonIds = createdLessons.filter(l => l.type === 'lab').map(l => l.id);
    if (labLessonIds.length > 0) {
      await labPrisma.labChallenge.deleteMany({
        where: { lessonId: { in: labLessonIds } }
      }).catch(() => {}); // Ignore if table doesn't exist
    }

    for (const lesson of createdLessons) {
      if (lesson.type === 'lab' && lesson.metadata) {
        try {
          const metadata = JSON.parse(lesson.metadata);
          const labMeta = metadata?.lab;
          
          if (labMeta && labMeta.kind) {
            const lessonModule = lesson.moduleId === module.id ? module : module2;
            const runtime = labMeta.kind === 'BACKEND_NODE' ? 'node18' : labMeta.kind === 'FRONTEND_NUXT' ? 'node18' : null;
            
            const challenge = await labPrisma.labChallenge.create({
              data: {
                title: lesson.title || 'Lab Challenge',
                slug: `lab-${lesson.id}-${Date.now()}`,
                description: lesson.content || lesson.title || '',
                difficulty: course.difficulty || 'Intermediate',
                courseId: course.id,
                moduleId: lessonModule.id,
                lessonId: lesson.id,
                createdByUserId: teacherId,
                visibility: 'private',
                runtime: runtime,
              }
            });
            
            labChallengesCreated.push({
              challengeId: challenge.id,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              kind: labMeta.kind,
            });
            
            console.log(`  ✅ Created challenge for: ${lesson.title} (${labMeta.kind})`);
          }
        } catch (e) {
          console.warn(`  ⚠️ Failed to create challenge for ${lesson.title}:`, e.message);
        }
      }
    }
    
    if (labChallengesCreated.length > 0) {
      console.log(`✅ Created ${labChallengesCreated.length} lab challenge(s)`);
    }
  } else {
    console.log("⚠️ Skipping lab challenge creation (teacher-course-lab DB not available)");
  }

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
    labChallengesCount: labChallengesCreated.length,
  });

  // Show lab lesson links
  const labLessons = createdLessons.filter(l => l.type === 'lab');
  if (labLessons.length > 0) {
    console.log("\n🔬 Lab Lessons (ready for students to start sessions):");
    labLessons.forEach((lesson, idx) => {
      const challenge = labChallengesCreated.find(c => c.lessonId === lesson.id);
      const lessonModule = lesson.moduleId === module.id ? module : module2;
      const url = `http://localhost:3000/student/${teacherId}/course/${course.id}/module/${lessonModule.id}`;
      console.log(`  ${idx + 1}. ${lesson.title}`);
      console.log(`     ${url}`);
      if (challenge) {
        console.log(`     Challenge ID: ${challenge.challengeId} (${challenge.kind})`);
      }
    });
  }

  console.log(
    `\n🌐 Main course page:\nhttp://localhost:3000/student/${teacherId}/course/${course.id}/module/${module.id}\n`
  );
}

main()
  .then(() => console.log("✅ Seeding complete"))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (labPrisma) {
      await labPrisma.$disconnect();
    }
  });
