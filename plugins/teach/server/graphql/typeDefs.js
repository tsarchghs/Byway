export const typeDefs = `#graphql
type TeacherCourse {
  id: ID!
  title: String!
  code: String
  createdAt: String!
}

type RosterEntry {
  id: ID!
  enrollmentId: String!
  studentId: String!
  courseId: String!
}

type TeacherProfile {
  id: ID!
  bio: String!
  subjects: String
  avatarUrl: String
  verified: Boolean
  payoutEmail: String
  createdAt: String!
}

type Query {
  teacherCourses(teacherId: String!): [TeacherCourse!]!
  courseRoster(courseId: String!): [RosterEntry!]!
  teacherProfile(id: String!): TeacherProfile
}

type Mutation {
  createCourse(title: String!, code: String, teacherId: String!): TeacherCourse!
  updateCourse(id: String!, title: String, code: String): TeacherCourse!
  assignTeacher(courseId: String!, teacherId: String!): TeacherCourse!
  createTeacherProfile(bio: String!, subjects: String, avatarUrl: String, payoutEmail: String): TeacherProfile!
}
`
