export const teachTypeDefs = /* GraphQL */ `
  type TeacherCourse { id: ID!, title: String!, students: Int! }
  type TeacherAssignment { id: ID!, title: String!, courseTitle: String!, submissions: Int! }
  type TeacherSignal { at: String!, message: String! }
  type TeacherOverview {
    courses: [TeacherCourse!]!
    assignments: [TeacherAssignment!]!
    signals: [TeacherSignal!]!
  }
  type Query { teacherOverview: TeacherOverview! }
`;
