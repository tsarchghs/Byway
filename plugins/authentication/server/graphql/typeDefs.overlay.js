// Overlay typeDefs for Authentication plugin
// Adds role/uiPrefs and safe "me" plus preference mutations
const typeDefsOverlay = `#graphql
  scalar JSON

  extend type User {
    role: String!
    avatarUrl: String
    uiPrefs: JSON
  }

  extend type Query {
    me: User
    uiPrefs: JSON
  }

  extend type Mutation {
    setMyRole(role: String!): User
    setUiPref(key: String!, value: JSON!): User
    setUiPrefs(patch: JSON!): User
  }
`

export default typeDefsOverlay
