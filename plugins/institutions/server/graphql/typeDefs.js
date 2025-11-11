// plugins/institutions/server/graphql/typeDefs.js
export const typeDefs = `#graphql
type Institution {
  id: ID!
  name: String!
  slug: String!
  createdAt: String!
  updatedAt: String!
}

type Classroom {
  id: ID!
  institutionId: String!
  name: String!
  code: String!
  createdAt: String!
  updatedAt: String!
}

type Query {
  institutions: [Institution!]!
  institutionBySlug(slug: String!): Institution
  classrooms(institutionId: String!): [Classroom!]!
}

type Mutation {
  createInstitution(name: String!, slug: String!): Institution!
  createClassroom(institutionId: String!, name: String!, code: String!): Classroom!
}
`
