
import { gql } from 'apollo-server-express'
import { prisma } from '../db/client.js'

export const typeDefs = gql`
  scalar JSON

  type Student {
    id: ID!
    userId: String
    displayName: String
  }

  type StudentCourse {
    id: ID!
    studentId: String!
    courseId: String!
    progress: Float
  }

  type GradeItem {
    id: ID!
    studentId: String!
    courseId: String!
    label: String
    score: Float
    feedback: String
  }

  input GradeInput {
    studentId: String!
    courseId: String!
    label: String
    score: Float
    feedback: String
  }

  input RubricItemInput {
    label: String!
    weight: Float!
  }

  type RubricItem {
    label: String!
    weight: Float!
  }

  type Rubric {
    courseId: String!
    items: [RubricItem!]!
  }

  type Query {
    isEnrolled(studentId: String!, courseId: String!): Boolean!
    myEnrollments(studentId: String): [StudentCourse!]!
    gradebook(courseId: String!): [GradeItem!]!
    courseRubric(courseId: String!): Rubric
  }

  type Mutation {
    enrollStudent(studentId: String!, courseId: String!): StudentCourse!
    setGrade(input: GradeInput!): GradeItem!
    upsertRubric(courseId: String!, items: [RubricItemInput!]!): Rubric!
  }
`

export const resolvers = {
  Query: {
    async isEnrolled(_, { studentId, courseId }) {
      const found = await prisma.studentCourse.findFirst({ where: { studentId, courseId } })
      return !!found
    },
    async myEnrollments(_, args, ctx) {
      const id = args.studentId || ctx.user?.id || ctx.user?.sub
      if (!id) return []
      return prisma.studentCourse.findMany({ where: { studentId: id } })
    },
    async gradebook(_, { courseId }) {
      // Collate submissions as "grade items"
      const subs = await prisma.studentSubmission.findMany({ where: { courseId } }).catch(()=>[])
      return subs.map(s => ({
        id: s.id,
        studentId: s.studentId,
        courseId: s.courseId,
        label: s.assignmentId || s.labId || s.quizId || 'Work',
        score: s.score ?? null,
        feedback: s.feedback ?? null
      }))
    },
    async courseRubric(_, { courseId }) {
      const rec = await prisma.rubric.findFirst({ where: { courseId } }).catch(()=>null)
      if (!rec) return null
      return { courseId, items: rec.items || [] }
    }
  },
  Mutation: {
    async enrollStudent(_, { studentId, courseId }) {
      const existing = await prisma.studentCourse.findFirst({ where: { studentId, courseId } })
      if (existing) return existing
      return prisma.studentCourse.create({ data: { studentId, courseId, progress: 0 } })
    },
    async setGrade(_, { input }) {
      const { studentId, courseId, label, score, feedback } = input
      // naive: use (studentId, courseId, label) to pick a submission (lab/assignment agnostic)
      const found = await prisma.studentSubmission.findFirst({ where: { studentId, courseId, label } }).catch(()=>null)
      const data = { studentId, courseId, label, score, feedback }
      const row = found
        ? await prisma.studentSubmission.update({ where: { id: found.id }, data })
        : await prisma.studentSubmission.create({ data })
      return {
        id: row.id,
        studentId: row.studentId,
        courseId: row.courseId,
        label: row.label,
        score: row.score ?? null,
        feedback: row.feedback ?? null
      }
    },
    async upsertRubric(_, { courseId, items }) {
      const existing = await prisma.rubric.findFirst({ where: { courseId } }).catch(()=>null)
      if (existing) {
        const rec = await prisma.rubric.update({ where: { id: existing.id }, data: { items } })
        return { courseId, items: rec.items || [] }
      }
      const rec = await prisma.rubric.create({ data: { courseId, items } })
      return { courseId, items: rec.items || [] }
    }
  }
}
