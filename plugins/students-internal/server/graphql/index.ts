// plugins/students-internal/server/graphql/index.ts
import { makeSchema } from 'nexus'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { DateTimeResolver, JSONResolver } from 'graphql-scalars'

// student-specific types
import {
  LessonStatus,
  StudentCourse,
  StudentProgress,
  StudentSubmission,
  Student,
} from './studentTypes.js'

// shared types from teach-internal (now all prefixed with Gql)
import { GqlLesson } from '../../../teach-internal/server/nexus/lessonTypes.js'
import { GqlModule, ModuleQuery } from '../../../teach-internal/server/nexus/moduleTypes.js'
import { GqlCourse } from '../../../teach-internal/server/nexus/courseTypes.js'

import { StudentQuery } from './studentQueries.js'
import { StudentMutation } from './studentMutations.js'

// ✅ get current directory (ESM-compatible)
const __dirname = dirname(fileURLToPath(import.meta.url))

export const schema = makeSchema({
  types: [
    DateTimeResolver,
    JSONResolver,
    // shared
    GqlCourse,
    GqlModule,
    GqlLesson,
    LessonStatus,
    // student
    Student,
    StudentCourse,
    StudentProgress,
    StudentSubmission,
    // resolvers
    StudentQuery,
    StudentMutation,
  ],

  outputs: {
    typegen: resolve(__dirname, './generated/nexus-typegen.ts'),
    schema: resolve(__dirname, './generated/schema.graphql'),
  },

  contextType: {
    module: resolve(__dirname, '../context.ts'),
    export: 'Context',
  },

  nonNullDefaults: {
    output: true,
    input: false,
  },
})
