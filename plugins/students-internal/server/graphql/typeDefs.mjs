export const studentTypeDefs = /* GraphQL */ `
  type GradebookCourse {
    id: ID!
    title: String!
    progressPct: Int!
    avgGrade: Float
  }
  type GradebookAssignment {
    id: ID!
    title: String!
    courseTitle: String!
    status: String!
    grade: Float
    submittedAt: String
  }
  type FeedItem { at: String!, message: String! }
  type GradebookOverview {
    byCourse: [GradebookCourse!]!
    byAssignment: [GradebookAssignment!]!
    activity: [FeedItem!]!
  }
  type Query {
    gradebookOverview: GradebookOverview!
  }
`;

export const typeDefs = `#graphql
scalar JSON

type Course {
  id: ID!
  title: String!
}

type Enrollment {
  id: ID!
  studentId: ID!
  courseId: ID!
  progressPct: Int!
}

type GradebookEntry {
  id: ID!
  assignmentId: ID!
  studentId: ID!
  courseId: ID!
  grade: Float
  feedback: String
  updatedAt: String
}

type Query {
  studentCourses(studentId: ID!): [Course!]!
  enrollments(studentId: ID, courseId: ID): [Enrollment!]!
  gradebook(courseId: ID!): [GradebookEntry!]!
  isEnrolled(studentId: ID!, courseId: ID!): Boolean!
}

input GradebookInput {
  studentId: ID!
  assignmentId: ID!
  courseId: ID!
  grade: Float
  feedback: String
}

type Mutation {
  upsertGrade(input: GradebookInput!): GradebookEntry!
  enrollStudent(studentId: ID!, courseId: ID!): Enrollment!
}
`;
