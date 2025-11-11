import { gql } from 'apollo-server-express';
export const typeDefs = gql`
  enum Role { STUDENT TEACHER INSTITUTION_ADMIN DEAN ADMIN }
  type User { id: ID!, email: String!, displayName: String, roles: [Role!]! }
  type Query { me: User }
`;

extend type Query {
  myUiPrefs: String
}
extend type Mutation {
  setMyUiPrefs(json:String!): Ok
}
