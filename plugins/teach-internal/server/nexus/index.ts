import path from 'path'
import { makeSchema } from 'nexus'
import { Course, CourseQuery, CourseMutation } from './courseTypes'
import { Module, ModuleQuery, ModuleMutation } from './moduleTypes'
import { Lesson, LessonQuery, LessonMutation } from './lessonTypes'
import { DateTimeResolver, JSONResolver } from 'graphql-scalars'

export const schema = makeSchema({
  types: [
    // Scalars
    DateTimeResolver, JSONResolver,
    // Models
    Course, Module, Lesson,
    // Queries
    CourseQuery, ModuleQuery, LessonQuery,
    // Mutations
    CourseMutation, ModuleMutation, LessonMutation,
  ],
  outputs: {
    typegen: path.join(process.cwd(), 'src/nexus/generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'src/nexus/generated/schema.graphql'),
  },
  contextType: {
    module: path.join(process.cwd(), 'src/context.ts'),
    export: 'Context',
  },
  nonNullDefaults: {
    output: true,
    input: false,
  },
  shouldExitAfterGenerateArtifacts: process.env.NODE_ENV === 'production',
})
