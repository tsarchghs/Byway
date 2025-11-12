import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar JSON

  type KV {
    key: String!
    value: String
  }

  type Enrollment {
    id: ID!
    studentId: String!
    courseId: String!
    progressPct: Int!
    createdAt: String!
    updatedAt: String!
  }

  type GradebookEntry {
    id: ID!
    assignmentId: String!
    studentId: String!
    courseId: String!
    grade: Float
    feedback: String
    createdAt: String!
    updatedAt: String!
  }

  # 👇 Add the missing StudentProgress type
  type StudentProgress {
    id: ID!
    studentId: String!
    courseId: String
    moduleId: String
    lessonId: String
    progress: Float
    updatedAt: String!
  }

type GqlStudentCourse {
  id: ID!
  studentId: String!
  courseId: String!
  progress: Float
  enrolledAt: String!
  completed: Boolean!
  course: GqlCourse
  }

  type GqlCourse {
    id: String
    teacherId: String
    title: String
    category: String
    difficulty: String
    description: String
    price: Float
    discount: Float
    coverUrl: String
    modules: [GqlModule!]
    createdAt: String
    updatedAt: String
    isEnrolled: Boolean
  }

  type GqlModule {
    id: String
    courseId: String
    title: String
    lessons: [GqlLesson!]
  }

  type GqlLesson {
    id: String
    moduleId: String
    title: String
    content: String
    duration: Int
    type: String
    videoUrl: String
    preview: Boolean
    rubric: String
    metadata: JSON
    createdAt: String
  }
  type Query {
myCourses(studentId: String!): [GqlStudentCourse!]!

    kvGet(key: String!): KV
    isEnrolled(studentId: String!, courseId: String!): Boolean!
    enrollments(studentId: String, courseId: String): [Enrollment!]!
    courseGradebook(courseId: ID!): [GradebookEntry!]!

    # 👇 Add this new query to match your resolver
    myProgress(courseId: String, moduleId: String, lessonId: String): [StudentProgress!]!
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
