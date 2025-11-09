export const typeDefs = /* GraphQL */ `
  enum EcOrderStatus { PENDING PAID CANCELLED REFUNDED }
  enum EcPaymentStatus { PENDING SUCCEEDED FAILED }

  input EcCartItemInput {
    courseId: String!
    quantity: Int = 1
  }

  type EcOrderItem {
    id: ID!
    courseId: String!
    titleSnapshot: String!
    priceSnapshot: Float!
    quantity: Int!
  }

  type EcPayment {
    id: ID!
    provider: String
    status: EcPaymentStatus!
    amount: Float!
    createdAt: String!
  }

  type EcOrder {
    id: ID!
    studentId: String!
    email: String
    currency: String!
    subtotal: Float!
    discount: Float!
    total: Float!
    status: EcOrderStatus!
    createdAt: String!
    updatedAt: String!
    items: [EcOrderItem!]!
    payments: [EcPayment!]!
  }

  type CouponValidation { percent: Int! }

  type CheckoutPayload {
    sessionId: String!
    url: String!
    orderId: String!
  }

  type Query {
    myOrders(studentId: String): [EcOrder!]!
    isEnrolled(courseId: String!, studentId: String): Boolean!
    verifyCheckout(sessionId: String!): VerifyCheckout!
    validateCoupon(courseId: String!, code: String!): CouponValidation!
  }

  type Mutation {
    createCheckout(
      items: [EcCartItemInput!]!
      coupon: String
      studentId: String
      email: String
      successUrl: String!
      cancelUrl: String!
    ): CheckoutPayload!
  }

  type VerifyCheckout {
    ok: Boolean!
    orderId: String
    status: EcOrderStatus
  }
`
