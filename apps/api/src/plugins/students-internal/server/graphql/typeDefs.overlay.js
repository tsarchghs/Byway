// students-internal overlay typeDefs
export default `#graphql
  type GradeMetrics {
    avgGrade: Float
    completed: Int!
    outstanding: Int!
  }
  type GradeCourseRow { id: ID!, title: String!, total: Int!, completed: Int!, grade: Float }
  type GradeModuleRow { id: ID!, title: String!, lessons: Int!, grade: Float }
  type GradeAssignmentRow { id: ID!, title: String!, courseTitle: String!, score: Float, status: String! }

  type GradebookOverview {
    metrics: GradeMetrics!
    courses: [GradeCourseRow!]!
    modules: [GradeModuleRow!]!
    assignments: [GradeAssignmentRow!]!
  }

  extend type Query {
    gradebookOverview: GradebookOverview!
  }
`
