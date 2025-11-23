import { gql } from 'apollo-server-express'

// Combined schema: legacy cart operations + checkout/enrollment flow.
export const typeDefs = gql`
  scalar JSON

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

  # Legacy cart types (kept for useCart() composable)
  type Payment {
    id: ID!
    orderId: String!
    provider: String
    status: String
    amount: Float!
    createdAt: String
  }

  type OrderItem {
    id: ID!
    orderId: String!
    courseId: String!
    titleSnapshot: String!
    priceSnapshot: Float!
    quantity: Int!
  }

  type Cart {
    id: ID!
    studentId: String!
    status: String!
    items: [OrderItem!]!
    payments: [Payment!]!
    updatedAt: String
    createdAt: String
  }

  type RemoveResult { ok: Boolean! }
  type ClearResult { ok: Boolean! }

  type CouponValidation { percent: Int! }

  type CheckoutPayload {
    sessionId: String!
    url: String!
    orderId: String!
  }

  type VerifyCheckout {
    ok: Boolean!
    orderId: String
    status: EcOrderStatus
  }

  type Query {
    cartByStudent(studentId: String!): Cart
    myOrders(studentId: String): [EcOrder!]!
    isEnrolled(courseId: String!, studentId: String): Boolean!
    verifyCheckout(sessionId: String!): VerifyCheckout!
    validateCoupon(courseId: String!, code: String!): CouponValidation!
  }

  type Mutation {
    addCartItem(studentId: String!, courseId: String!, quantity: Int = 1): OrderItem!
    removeCartItem(studentId: String!, orderItemId: String!): RemoveResult!
    clearCart(studentId: String!): ClearResult!
    createCheckout(
      items: [EcCartItemInput!]!
      coupon: String
      studentId: String
      email: String
      successUrl: String!
      cancelUrl: String!
    ): CheckoutPayload!
  }
`
