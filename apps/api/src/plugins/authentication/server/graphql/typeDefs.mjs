// plugins/authentication/server/graphql/typeDefs.mjs
export const authUiTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    role: String
    avatarUrl: String
    uiPrefsJson: String
  }

  type Query {
    me: User
    uiPrefs: String
  }

  type Mutation {
    setUiPref(key: String!, value: String!): Boolean!
    setUiPrefs(patchJson: String!): Boolean!
    setMyRole(role: String!): Boolean!
  }
`;
