# ecommerce API notes

This file documents the behavior of the `ecommerce` plugin endpoints that other plugins or the frontend should consume.

GraphQL (POST /api/ecommerce/graphql)

- Mutations
  - `createCheckout(items:[EcCartItemInput!]!, successUrl:String!, cancelUrl:String!, studentId:String, email:String): { sessionId, url, orderId }`
    - Creates a PENDING `order` in ecommerce DB and a Stripe Checkout session.
    - IMPORTANT: Before creating the order/session the resolver checks enrollment (calls `students-internal`) for each cart item. If the buyer is already enrolled in any course in the cart the mutation throws an error and aborts.
    - Errors you may see: `Already enrolled in course: <title>` — frontend should capture this and show a helpful message/link to the course.

- Queries
  - `verifyCheckout(sessionId: String!): { ok: Boolean!, orderId: String, status: String }` — used by the frontend to confirm backend processed the session and marked order PAID.

Webhook
- `/api/ecommerce/stripe/webhook` — Stripe webhook. When `checkout.session.completed` arrives the handler:
  1. Validates the webhook signature.
  2. Marks the `order` as `PAID` and writes a `payment` row.
  3. Calls `students-internal` enrollment mutations to create StudentCourse rows for each purchased course. Calls are idempotent; retries are attempted on transient failures.

Integration notes
- Frontend should not assume immediate enrollment after redirect from Stripe. Use `verifyCheckout(session_id)` to confirm the backend marked the order as PAID and enrollment ran. Alternatively poll `isEnrolledMe(courseId)`.

Example client handling for duplicate-purchase error:

```js
try {
  const resp = await fetch('/api/ecommerce/graphql', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ query:`mutation($items:[EcCartItemInput!]!,$successUrl:String!,$cancelUrl:String!){ createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl){ sessionId url orderId } }`, variables:{ items, successUrl, cancelUrl } }) })
  const json = await resp.json()
  if (json.errors) throw new Error(json.errors[0].message)
  // redirect to json.data.createCheckout.url
} catch (err) {
  if (err.message.includes('Already enrolled')) {
    // show link to course page instead of allowing checkout
  } else {
    // generic error handling
  }
}
```
# ecommerce plugin — API notes

This plugin exposes a GraphQL API under `/api/ecommerce/graphql` for creating checkouts and querying orders. It also receives Stripe webhooks to mark orders as paid and will call other plugins (teach/students) to fetch course data and enroll students.

Important endpoints
- GraphQL: `POST /api/ecommerce/graphql`
- Stripe webhook: `POST /api/ecommerce/stripe/webhook` (raw body)

Useful GraphQL operations

1) createCheckout (mutation)

Call from a frontend or another plugin to create a Stripe Checkout session:

mutation createCheckout($items:[EcCartItemInput!]!, $successUrl:String!, $cancelUrl:String!) {
  createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl) { sessionId url orderId }
}

Example (server-side caller using $fetch):

```ts
const { url } = await $fetch('/api/ecommerce/graphql', {
  method: 'POST',
  body: JSON.stringify({
    query: `mutation($items:[EcCartItemInput!]!,$successUrl:String!,$cancelUrl:String!){ createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl){ sessionId url orderId } }`,
    variables: { items, successUrl, cancelUrl }
  }),
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` }
})
// redirect user to url
```

2) verifyCheckout (query)

After the Stripe redirect to the success page you can ask the ecommerce plugin to verify the session and confirm the backend has processed the payment (webhook might already have run):

query verify($s:String!){ verifyCheckout(sessionId:$s){ ok orderId status } }

This repository's checkout success page now calls `verifyCheckout(session_id)` and only clears the client cart after the backend confirms payment.

Notes on plugin isolation
- This plugin calls other plugins' GraphQL endpoints for course data and enrollments using the local cluster host (`/api/teach-internal/graphql`, `/api/students-internal/graphql`). It never imports other plugins' Prisma clients or schemas directly.

Reconciliation endpoint
- `POST /api/ecommerce/reconcile` — scans recent PAID orders and attempts to ensure students are enrolled for purchased courses (useful if webhooks failed). For safety this endpoint requires an admin token when `RECONCILE_ADMIN_TOKEN` is configured in the environment. Provide the token via the `x-reconcile-token` header or as a Bearer token in `Authorization`.

Example (server-to-server):
```
fetch('http://localhost:4000/api/ecommerce/reconcile', {
  method: 'POST',
  headers: { 'x-reconcile-token': process.env.RECONCILE_ADMIN_TOKEN }
})
```
