import { makeSchema } from 'nexus'
import path from 'path'
import * as Course from './courseTypes.js'
import * as Module from './moduleTypes.js'
import * as Lesson from './lessonTypes.js'

export const schema = makeSchema({
  types: [Course, Module, Lesson],
  outputs: {
    schema: path.join(process.cwd(), 'plugins/teach-internal/server/db/schema.graphql'),
    typegen: path.join(process.cwd(), 'plugins/teach-internal/server/db/nexus-typegen.ts'),
  },
})
