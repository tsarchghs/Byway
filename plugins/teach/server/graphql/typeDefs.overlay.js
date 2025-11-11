// teach overlay typeDefs
export default `#graphql
  type TeacherMetrics { students: Int!, courses: Int!, pending: Int! }
  type TeacherCourseRow { id: ID!, title: String!, published: Boolean!, enrolled: Int! }
  type TeacherAssignmentRow { id: ID!, title: String!, courseTitle: String!, submissions: Int!, pending: Int! }

  type TeacherOverview {
    metrics: TeacherMetrics!
    courses: [TeacherCourseRow!]!
    assignments: [TeacherAssignmentRow!]!
  }

  extend type Query { teacherOverview: TeacherOverview! }
`
