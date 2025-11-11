import { gql } from 'apollo-server-express'
export const typeDefs = gql`
  scalar JSON
  type KV { key: String!, value: String }
  type Enrollment { id: ID!, studentId: String!, courseId: String!, progressPct: Int!, createdAt: String!, updatedAt: String! }
  type GradebookEntry { id: ID!, assignmentId: String!, studentId: String!, courseId: String!, grade: Float, feedback: String, createdAt: String!, updatedAt: String! }

  type Query {
    kvGet(key: String!): KV
    isEnrolled(studentId: String!, courseId: String!): Boolean!
    enrollments(studentId: String, courseId: String): [Enrollment!]!
    courseGradebook(courseId: ID!): [GradebookEntry!]!
  }

  input GradebookInput {
    id: ID
    assignmentId: String!
    studentId: String!
    courseId: String!
    grade: Float
    feedback: String
  }

  type Mutation {
    kvSet(key: String!, value: String): KV
    kvDelete(key: String!): Boolean!
    enrollStudent(studentId: String!, courseId: String!): Enrollment!
    upsertGrade(input: GradebookInput!): GradebookEntry!
    setProgress(enrollmentId: ID!, progressPct: Int!): Enrollment!
  }
`
