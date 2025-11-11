import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar JSON

  type Course { id: ID!, title: String! }
  type Enrollment { id: ID!, studentId: ID!, courseId: ID!, progressPct: Int!, createdAt: String!, updatedAt: String! }
  type GradebookEntry { 
    id: ID!, 
    assignmentId: ID!, 
    studentId: ID!, 
    courseId: ID!, 
    grade: Float, 
    feedback: String, 
    updatedAt: String! 
  }

  type KVPair { key: String!, value: String }

  input GradebookInput { assignmentId: ID!, studentId: ID!, courseId: ID!, grade: Float, feedback: String }

  type Query {
    studentCourses(studentId: ID!): [Course!]!
    enrollments(studentId: ID, courseId: ID): [Enrollment!]!
    courseGradebook(courseId: ID!): [GradebookEntry!]!
    isEnrolled(studentId: ID!, courseId: ID!): Boolean!
    kvGet(key: String!): KVPair
  }

  type Mutation {
    enrollStudent(studentId: ID!, courseId: ID!): Enrollment!
    upsertGrade(input: GradebookInput!): GradebookEntry!
    kvSet(key: String!, value: String): KVPair!
    kvDelete(key: String!): Boolean!
  }
`;
