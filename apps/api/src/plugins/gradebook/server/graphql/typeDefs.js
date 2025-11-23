// Gradebook GraphQL schema
// Keeping it small but expressive; other plugins can call this as a shared gradebook service.
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar JSON

  type GradebookEntry {
    id: ID!
    courseId: String!
    courseTitle: String
    studentId: String!
    studentDisplayName: String
    assignmentId: String
    assignmentTitle: String
    score: Float
    maxScore: Float
    percentage: Float
    letter: String
    feedback: String
    metadata: JSON
    createdAt: String!
    updatedAt: String!
  }

  input GradebookEntryInput {
    id: ID
    courseId: String!
    courseTitle: String
    studentId: String!
    studentDisplayName: String
    assignmentId: String
    assignmentTitle: String
    score: Float
    maxScore: Float
    letter: String
    feedback: String
    metadata: JSON
  }

  type Query {
    gradebookByStudent(studentId: String!): [GradebookEntry!]!
    gradebookByCourse(courseId: String!): [GradebookEntry!]!
    gradebookEntry(id: ID!): GradebookEntry
  }

  type Mutation {
    upsertGradebookEntry(input: GradebookEntryInput!): GradebookEntry!
    deleteGradebookEntry(id: ID!): Boolean!
  }
`;
