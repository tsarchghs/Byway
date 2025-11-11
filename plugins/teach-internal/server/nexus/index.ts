// ✅ ESM-safe and fully aligned schema
import { makeSchema } from 'nexus'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { DateTimeResolver, JSONResolver } from 'graphql-scalars'

// Import prefixed GraphQL objects
import { GqlCourse, CourseQuery, CourseMutation } from './courseTypes.js'
import { GqlModule, ModuleQuery, ModuleMutation } from './moduleTypes.js'
import { GqlLesson, LessonQuery, LessonMutation } from './lessonTypes.js'
import { GqlClassroom, ClassroomQuery, ClassroomMutation } from './classroomTypes.js'
import {
  GqlAssignment,
  GqlSubmission,
  AssignmentQuery,
  AssignmentMutation,
  SubmissionQuery,
  SubmissionMutation,
} from './assignmentTypes.js'

// ESM-safe dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

export const schema = makeSchema({
  types: [
    // Scalars
    DateTimeResolver,
    JSONResolver,

    // Models
    GqlCourse,
    GqlModule,
    GqlLesson,
    GqlClassroom,
    GqlAssignment,
    GqlSubmission,

    // Queries
    CourseQuery,
    ModuleQuery,
    LessonQuery,
    ClassroomQuery,
    AssignmentQuery,
    SubmissionQuery,

    // Mutations
    CourseMutation,
    ModuleMutation,
    LessonMutation,
    ClassroomMutation,
    AssignmentMutation,
    SubmissionMutation,
  ],

  // ✅ ESM-safe output locations
  outputs: {
    typegen: resolve(__dirname, '../generated/nexus-typegen.ts'),
    schema: resolve(__dirname, '../generated/schema.graphql'),
  },

  contextType: {
    module: resolve(__dirname, '../context.ts'),
    export: 'Context',
  },

  nonNullDefaults: {
    output: true,
    input: false,
  },

  shouldExitAfterGenerateArtifacts: process.env.NODE_ENV === 'production',
})
