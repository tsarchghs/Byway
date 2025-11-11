// students-internal/server/graphql/typeDefs.js
export default `#graphql
scalar JSON

type Enrollment {
  id: ID!
  studentId: String!
  courseId: String!
  progress: Int!
  createdAt: String!
  updatedAt: String!
}

type GradeItem {
  id: ID!
  enrollmentId: String!
  label: String!
  points: Float!
  weight: Float!
  updatedAt: String!
}

input GradeItemInput {
  enrollmentId: String!
  label: String!
  points: Float!
  weight: Float!
}

type RubricItem {
  label: String!
  weight: Float!
}
input RubricItemInput {
  label: String!
  weight: Float!
}

type Rubric {
  id: ID!
  courseId: String!
  items: [RubricItem!]!
  updatedAt: String!
}

type StudentCourse {
  id: ID!
  courseId: String!
  studentId: String!
}

type Query {
  meRole: String!
  myEnrollments(studentId: String!): [Enrollment!]!
  isEnrolled(studentId: String!, courseId: String!): Boolean!
  gradebook(courseId: String!): [GradeItem!]!
  rubric(courseId: String!): Rubric
}

type Mutation {
  enrollStudent(studentId: String!, courseId: String!): Enrollment!
  setProgress(enrollmentId: String!, value: Int!): Enrollment!
  setRubric(courseId: String!, items: [RubricItemInput!]!): Rubric!
  upsertGradeItems(items: [GradeItemInput!]!): [GradeItem!]!
}
`
