export default `#graphql
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
type Query {
  teacherCourses(teacherId: String!): [TeacherCourse!]!
  courseRoster(courseId: String!): [RosterEntry!]!
}
`
