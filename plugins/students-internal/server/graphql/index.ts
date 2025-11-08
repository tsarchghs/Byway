// plugins/students-internal/server/graphql/index.ts
import path from 'path'
import { makeSchema } from 'nexus'

// shared types from teach-internal

// student-specific types
import {
    LessonStatus,
  StudentCourse,
  StudentProgress,
  StudentSubmission,
} from './studentTypes.js'

import { DateTimeResolver, JSONResolver } from 'graphql-scalars'
import { Lesson } from '../../../teach-internal/server/nexus/lessonTypes.js'
import { Module, ModuleQuery } from '../../../teach-internal/server/nexus/moduleTypes.js'
import { Course } from '../../../teach-internal/server/nexus/courseTypes.js'
import { StudentQuery } from './studentQueries.js'
import { StudentMutation } from './studentMutations.js'

export const schema = makeSchema({
  types: [
    DateTimeResolver,
    JSONResolver,
    // shared
    Course, Module, Lesson, LessonStatus,
    // student
    StudentCourse,
    StudentProgress,
    StudentSubmission,
    // resolvers
    StudentQuery,
    StudentMutation,
  ],
  outputs: {
    typegen: path.join(process.cwd(), 'plugins/students-internal/server/graphql/generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'plugins/students-internal/server/graphql/generated/schema.graphql'),
  },
  contextType: {
    module: path.join(process.cwd(), 'plugins/students-internal/server/context.ts'),
    export: 'Context',
  },
  nonNullDefaults: {
    output: true,
    input: false,
  },
})
