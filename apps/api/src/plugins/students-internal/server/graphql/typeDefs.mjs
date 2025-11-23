export const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar JSON

  enum StudentCourseStatus { ENROLLED COMPLETED DROPPED }

  type Enrollment { 
    id: ID!
    studentId: String!
    courseId: String!
    status: String!
    createdAt: DateTime!
  }

  type GradebookEntry {
    id: ID!
    studentId: String!
    courseId: String!
    assignmentId: String
    label: String
    points: Float!
    maxPoints: Float!
    percentage: Float!
    updatedAt: DateTime!
    assignment: Assignment
    course: Course
  }

  type Course {
    id: ID!
    title: String!
  }

  type Assignment {
    id: ID!
    title: String!
    dueDate: DateTime
  }

  input GradeInput {
    studentId: String!
    courseId: String!
    assignmentId: String
    label: String
    points: Float!
    maxPoints: Float!
  }

  type GradeGroup {
    id: ID!
    name: String!
    avg: Float!
    count: Int!
  }

  type GradebookOverview {
    totalCourses: Int!
    completed: Int!
    avg: Float!
    recentUpdates: [GradebookEntry!]!
    byCourse: [GradeGroup!]!
    byAssignment: [GradeGroup!]!
  }

  type Query {
    isEnrolled(studentId: String!, courseId: String!): Boolean!
    enrollments(studentId: String!): [Enrollment!]!
    gradebook(studentId: String!, courseId: String): [GradebookEntry!]!
    gradebookOverview(studentId: String!): GradebookOverview!
  }

  type Mutation {
    enrollStudent(studentId: String!, courseId: String!): Enrollment!
    upsertGrade(input: GradeInput!): GradebookEntry!
  createStudent(
    institutionId: String!
    userId: String!
  ): GqlStudent

  }
`;
