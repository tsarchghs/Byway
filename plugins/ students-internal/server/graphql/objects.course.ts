// students-internal/server/graphql/objects.course.ts
import { objectType, list, nonNull } from 'nexus'

// Reuse your existing types: CourseLite, ModuleLite, LessonLite

export const StudentProgress = objectType({
  name: 'StudentProgress',
  definition(t) {
    t.nonNull.list.nonNull.string('completedLessonIds')
    t.nullable.string('lastLessonId')
  },
})

export const StudentCourseResult = objectType({
  name: 'StudentCourseResult',
  definition(t) {
    t.field('course', { type: 'CourseLite' })
    t.nonNull.list.nonNull.field('modules', { type: 'ModuleLite' })
    t.nonNull.field('progress', { type: 'StudentProgress' })
  },
})

export const StudentModuleResult = objectType({
  name: 'StudentModuleResult',
  definition(t) {
    t.field('course', { type: 'CourseLite' })
    // Reuse ModuleLite shape; if you prefer the lessons inline, use a specific type
    t.field('module', { type: 'ModuleLite' })
    t.nonNull.field('progress', { type: 'StudentProgress' })
  },
})
