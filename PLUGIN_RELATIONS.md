# Plugin relations and enforcement (Byway)

This file documents the cross-plugin relations in the Byway workspace and the APIs that enforce them. The goal: keep plugins isolated (each with its own Prisma DB/schema) but make the system behave as if a single DB existed by enforcing relationships through API calls and business rules.

Overview
- Plugin isolation: each plugin owns its Prisma schema and DB in `/plugins/<plugin>/server/db/schema.prisma` (or `apps/api/plugins/...`).
- Cross-plugin relations are modelled as ID fields in Prisma (e.g., `studentId`, `courseId`, `teacherId`) and verified/enforced at the API/resolver layer.

Key cross-plugin relations (current state)

1) authentication.user.id ↔ students-internal.student.userId
  - students-internal: `Student.userId` holds the `authentication` `User.id` (optional).
  - Enforcement APIs:
    - `authentication` exposes `me` (GraphQL) and `updateUserTeacherProfile`.
    - `students-internal` exposes `enrollMe`, `enrollStudent`, `isEnrolled`, `isEnrolledMe` (GraphQL). Other plugins call these GraphQL endpoints to check/enroll.

2) authentication.user.teacherProfileId ↔ teach.TeacherProfile.id
  - `teach` plugin `TeacherProfile` is created locally then `authentication.updateUserTeacherProfile` updates `User.teacherProfileId` (API call).
  - Enforcement: `teach.createTeacherProfile` uses `fetchCurrentUser(token)` then `linkTeacherProfileToUser(token, teacherProfileId)` to set the reference.

3) teach-internal.course.teacherId ↔ authentication.user.id (soft link)
  - `teach-internal` stores `Course.teacherId` (string) which references `authentication.User.id` by convention.
  - Enforcement: course creation/update in `teach-internal` now validates that the caller is the owner and that the corresponding `TeacherProfile` is verified by calling `authentication` (for identity) and `teach` (for `teacherProfile.verified`).

4) ecommerce.order.studentId ↔ students-internal.student.id
  - `ecommerce.Order.studentId` stores the student id (string). `createCheckout` requires `sid` (JWT or passed `studentId`) and uses it when creating orders and Stripe session metadata.
  - Enforcement: `ecommerce.createCheckout` calls `students-internal.isEnrolled/isEnrolledMe` for each cart item to prevent duplicate purchases. The Stripe webhook marks the order PAID and calls `students-internal.enrollMe` or `enrollStudent` to create enrollment rows.

5) ecommerce.OrderItem.courseId ↔ teach-internal.course.id
  - `OrderItem.courseId` stores the course id. `createCheckout` uses `teach-internal` `course` data for pricing/snapshot.
  - Enforcement: `ecommerce` fetches course info from `teach-internal` via GraphQL when building line items and snapshots.

6) students-internal.StudentCourse.courseId ↔ teach-internal.Course.id
  - `students-internal` `StudentCourse` uses `courseId` as the canonical link to courses in `teach-internal`.
  - Enforcement: `students-internal` exposes `isEnrolled`/`isEnrolledMe` for other services to verify enrollment; its `enroll` mutations are idempotent (upsert) and constrained by a unique index on `(studentId, courseId)`.

APIs that enforce relations (quick mapping)
- students-internal
  - GraphQL: `enrollMe(courseId)`, `enrollStudent(studentId, courseId)`, `isEnrolled(studentId, courseId)`, `isEnrolledMe(courseId)`, `myCourses(studentId)`.
  - REST: `POST /api/students-internal/students` to create Student rows.

- ecommerce
  - GraphQL: `createCheckout(items, successUrl, cancelUrl, studentId, email)` — checks enrollment via `students-internal` before creating `order` and Stripe session.
  - GraphQL: `verifyCheckout(sessionId)` — used by frontend to confirm backend processed the session and marked order PAID.
  - REST: `/api/ecommerce/stripe/webhook` — on `checkout.session.completed` marks order PAID and calls enrollment APIs.
  - REST: `/api/ecommerce/reconcile` — admin/reconciliation endpoint to retry enrollments for PAID orders that missed webhook.

- teach-internal
  - GraphQL: `course(id)` and `courses()` — updated to expose `Course.isEnrolled` resolved by calling `students-internal.isEnrolledMe` when a JWT is present.

- teach
  - GraphQL: `createTeacherProfile` → creates TeacherProfile and calls `authentication` to link profile id to the user.

Design & enforcement patterns used
- Idempotent upserts: Enrollment mutations use upsert semantics (unique constraint on `(studentId, courseId)`) so repeated calls are safe.
- API-based verification: Before cross-plugin actions that require consistency (create order, create course, grant access), the code calls the owning plugin's API to verify the necessary condition (e.g., enrollment, teacher verification, ownership).
- Webhook-to-API enrollment: Stripe webhook finalizes payment and invokes the students-internal enroll APIs server-to-server. Webhook logic retries transient failures and logs permanent failures; a reconcile endpoint exists to repair missed enrollments.
- Minimal exposure: Plugins expose explicit GraphQL queries/mutations for other plugins to use; they do not export internal DB clients.

Practical examples

1) Prevent duplicate purchase (ecommerce):

  - ecommerce `createCheckout` does:
    - For each cart item `courseId` call `students-internal`:
      - If JWT: `isEnrolledMe(courseId)`
      - Else: `isEnrolled(studentId, courseId)`
    - If enrolled → throw `Already enrolled in course: <title>` and abort checkout.

2) Post-payment enrollment flow (webhook):

  - Stripe webhook receives `checkout.session.completed` → find `orderId` from `session.metadata`.
  - Update `order.status = PAID` and create `payment` row.
  - For each `OrderItem.courseId` call `students-internal.enrollMe` (prefer JWT in metadata) or `enrollStudent(studentId, courseId)`.
  - Calls are idempotent; webhook uses small retry/backoff. An admin-facing `/reconcile` endpoint can retry missed enrollments.

3) Gate content in teach-internal:

  - teach-internal `Course.isEnrolled` field resolves via `students-internal` using the request JWT (if present). Clients can use that to hide/show lessons.

Security & operational notes
- Authentication forwarding: when making cross-plugin calls on behalf of a user, forward the JWT as `Authorization: Bearer <token>` so the target plugin can perform `isEnrolledMe` or `enrollMe`. For server-side calls that are not on behalf of a user (e.g., reconcile), use explicit admin calls and authenticate the endpoint (currently reconcile is unauthenticated — consider protecting it with an admin token or internal-only route).
- Service discovery: current calls use `http://localhost:4000/api/<plugin>/graphql`. For production or multi-host setups, replace with a service registry or environment-driven base URLs.
- Observability: log enrollment attempts & reconciliation outcome; alert on repeated failures.

Next steps & recommendations
- Protect the `/reconcile` endpoint with an admin auth header or move it behind an internal-only network.
- Add integration tests that mock cross-plugin GraphQL calls to ensure `createCheckout` rejects duplicates and webhook/enroll flows succeed.
- Add client-side UX improvements: when `createCheckout` fails with `Already enrolled`, show a friendly modal linking to the course page rather than a generic error. On checkout success, poll `verifyCheckout` or `isEnrolledMe` until enrollment appears or a timeout.
- Move callGraphQL helper to a shared utility package if many plugins need the same logic for service address resolution.

If you want, I can:
- Add admin-protected middleware to `/api/ecommerce/reconcile`.
- Implement integration tests for the ecommerce→students flow.
- Convert the reconcile endpoint to a scheduled job (cron) inside the ecommerce plugin.

---
This document reflects current schema and API wiring as of the latest changes in the repo. Use this as the canonical mapping when adding new plugin features or validations.
