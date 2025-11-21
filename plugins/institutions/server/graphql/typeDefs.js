// plugins/institutions/server/graphql/typeDefs.js
export const typeDefs = `#graphql
type Institution {
  id: ID!
  name: String!
  slug: String!
  type: String
  location: String
  email: String
  phone: String
  active: Boolean!
  createdAt: String!
  updatedAt: String!
  departments: [Department!]
  classrooms: [Classroom!]
  members: [InstitutionMember!]
}

type Classroom {
  id: ID!
  institutionId: String!
  departmentId: String
  teacherId: String
  title: String!
  code: String!
  capacity: Int
  status: String
  startsAt: String
  endsAt: String
  courseIds: String
  enrollments: [ClassroomEnrollment!]
  createdAt: String!
  updatedAt: String!
}

type Department {
  id: ID!
  institutionId: String!
  name: String!
  slug: String!
  contact: String
  head: String
  active: Boolean!
  createdAt: String!
  updatedAt: String!
}

type InstitutionMember {
  id: ID!
  institutionId: String!
  userId: String!
  role: String!
  status: String!
  createdAt: String!
  updatedAt: String!
}

type ClassroomEnrollment {
  id: ID!
  classroomId: String!
  studentId: String!
  status: String!
}

type InstitutionInvite {
  id: ID!
  institutionId: String!
  code: String!
  role: String!
  expiresAt: String
  createdAt: String!
}

type InstitutionStats {
  classrooms: Int!
  activeClassrooms: Int!
  departments: Int!
  members: Int!
  students: Int!
}

type Query {
  institutions: [Institution!]!
  institution(id: String!): Institution
  institutionBySlug(slug: String!): Institution
  departments(institutionId: String!): [Department!]!
  classrooms(institutionId: String, departmentId: String): [Classroom!]!
  members(institutionId: String!, role: String): [InstitutionMember!]!
  stats(institutionId: String!): InstitutionStats!
}

type Mutation {
  createInstitution(name: String!, slug: String!, type: String, location: String, email: String, phone: String, active: Boolean): Institution!
  updateInstitution(id: String!, name: String, slug: String, type: String, location: String, email: String, phone: String, active: Boolean): Institution!

  createDepartment(institutionId: String!, name: String!, slug: String!, contact: String, head: String, active: Boolean): Department!
  updateDepartment(id: String!, name: String, slug: String, contact: String, head: String, active: Boolean): Department!

  createClassroom(institutionId: String!, departmentId: String, name: String!, code: String!, teacherId: String, capacity: Int, status: String, startsAt: String, endsAt: String, courseIds: String): Classroom!
  updateClassroom(id: String!, departmentId: String, name: String, code: String, teacherId: String, capacity: Int, status: String, startsAt: String, endsAt: String, courseIds: String): Classroom!

  addMember(institutionId: String!, userId: String!, role: String!, status: String): InstitutionMember!
  removeMember(id: String!): Boolean!
  updateMemberRole(id: String!, role: String!, status: String): InstitutionMember!

  createInvite(institutionId: String!, role: String!, expiresAt: String): InstitutionInvite!
  redeemInvite(code: String!, userId: String!): InstitutionMember!
}
`
