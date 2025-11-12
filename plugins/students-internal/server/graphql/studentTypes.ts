import { objectType, enumType } from 'nexus'

// Map Prisma enum for status
export const LessonStatus = enumType({
  name: 'LessonStatus',
  members: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
})

// Minimal Student object exposed via GraphQL for cross-plugin checks
export const Student = objectType({
  name: 'GqlStudent',
  definition(t) {
    t.string('id')
    t.nullable.string('userId')
    t.nullable.string('displayName')
    t.field('createdAt', { type: 'DateTime' })
  },
})

// Prisma → Nexus mapping
export const StudentCourse = objectType({
  name: 'GqlStudentCourse',
  definition(t) {
    t.string('id')
    t.string('studentId')
    t.string('courseId')
    // optional course relation (in GraphQL only, not Prisma enforced)
    t.nullable.field('course', { type: 'GqlCourse' })
    t.boolean('completed')
    t.nullable.int('progress')
    t.field('enrolledAt', { type: 'DateTime' })
  },
})

// Resolved from LessonProgress table
export const StudentProgress = objectType({
  name: 'StudentProgress',
  definition(t) {
    t.string('id')
    t.string('studentId')
    t.string('lessonId')
    // Convert Prisma enum to a boolean-like field for frontend simplicity
    t.boolean('completed', {
      resolve: (root) => root.status === 'COMPLETED',
    })
    t.field('status', { type: 'LessonStatus' }) // expose full status if needed
    t.nullable.float('score')
    t.nullable.field('updatedAt', { type: 'DateTime' })
  },
})

// Resolved from StudentSubmission table
export const StudentSubmission = objectType({
  name: 'GqlStudentSubmission',
  definition(t) {
    t.string('id')
    t.string('studentId')
    t.string('lessonId')
    t.string('type')
    t.nullable.string('content')
    t.nullable.float('grade')
    t.field('submittedAt', { type: 'DateTime' })
  },
})

export const MyCoursesQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("myProgress", {
      type: "StudentProgress",
      description: "Return the current student's lesson progress entries",
      args: {
        courseId: "String", // optional filter
        moduleId: "String", // optional filter
        lessonId: "String", // optional filter
      },
      async resolve(_, args, ctx) {
        if (!ctx.user?.id) throw new Error("Not authenticated");

        const filters: any = { studentId: ctx.user.id };
        if (args.courseId) filters.courseId = args.courseId;
        if (args.moduleId) filters.moduleId = args.moduleId;
        if (args.lessonId) filters.lessonId = args.lessonId;

        return ctx.prisma.StudentProgress.findMany({
          where: filters,
          orderBy: { updatedAt: "desc" },
        });
      },
    });
  },
  definition(t) {
    t.list.field("myCourses", {
      type: "GqlCourse",
      description: "Courses that the authenticated student is enrolled in",
      resolve: async (_, __, ctx) => {
        if (!ctx.user?.id) throw new Error("Not authenticated");
        return ctx.prisma.course.findMany({
          where: { enrollments: { some: { studentId: ctx.user.id } } },
          include: { modules: true },
        });
      },
    });
  },
});
