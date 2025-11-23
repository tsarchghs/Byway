// plugins/courses-internal/server/graphql/schema.ts
export const typeDefs = `#graphql
  type Lesson {
    id: ID!
    title: String
    duration: String
  }

  type Module {
    id: ID!
    title: String
    lessons: [Lesson]
  }

  type Course {
    id: ID!
    title: String
    category: String
    difficulty: String
    description: String
    price: Float
    discount: Float
    coverUrl: String
    teacherId: String
    modules: [Module]
    createdAt: String
    updatedAt: String
  }

  type CouponResult {
    percent: Int!
  }

  type Query {
    course(id: String!): Course
    courses: [Course]
    validateCoupon(courseId: String!, code: String!): CouponResult
  }
`
