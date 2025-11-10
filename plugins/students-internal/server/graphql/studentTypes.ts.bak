import { objectType, enumType } from 'nexus'

// Map Prisma enum for status
export const LessonStatus = enumType({
  name: 'LessonStatus',
  members: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
})

// Minimal Student object exposed via GraphQL for cross-plugin checks
export const Student = objectType({
  name: 'Student',
  definition(t) {
    t.string('id')
    t.nullable.string('userId')
    t.nullable.string('displayName')
    t.field('createdAt', { type: 'DateTime' })
  },
})

// Prisma → Nexus mapping
export const StudentCourse = objectType({
  name: 'StudentCourse',
  definition(t) {
    t.string('id')
    t.string('studentId')
    t.string('courseId')
    // optional course relation (in GraphQL only, not Prisma enforced)
    t.nullable.field('course', { type: 'Course' })
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
  name: 'StudentSubmission',
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
