# students-internal API

This document describes the public APIs exposed by the `students-internal` plugin.

GraphQL (POST /api/students-internal/graphql)

- Mutations
  - `enrollMe(courseId: String!): StudentCourse` — idempotent. Uses the JWT from Authorization header to find the calling student. Creates Student record if needed and upserts StudentCourse. Returns the enrollment row.
  - `enrollStudent(studentId: String!, courseId: String!): StudentCourse` — admin-style enroll by studentId. Idempotent (upsert).
- Queries
  - `isEnrolled(studentId: String!, courseId: String!): Boolean` — check enrollment for a studentId (server-to-server).
  - `isEnrolledMe(courseId: String!): Boolean` — check enrollment for the current JWT-authenticated user.
  - `myCourses(studentId: String!): [StudentCourse]` — list enrollments for a student.

REST
- `POST /api/students-internal/students` — create a Student row. Body: `{ userId: string, displayName?: string }`.

Examples

Client (call enrollMe using JWT):

```js
await fetch('/api/students-internal/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ query: `mutation ($courseId: String!) { enrollMe(courseId: $courseId){ id } }`, variables: { courseId } }),
})
```

Server (call enrollStudent from another plugin):

```js
const query = `mutation ($studentId:String!, $courseId:String!){ enrollStudent(studentId:$studentId, courseId:$courseId){ id } }`
await fetch('http://localhost:4000/api/students-internal/graphql', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables:{ studentId, courseId } }) })
```

Idempotency
- Both enroll mutations are safe to call multiple times. They use upsert semantics and a unique constraint on `(studentId, courseId)` to guarantee no duplicate enrollments.
# students-internal plugin — API

This file documents the minimal REST API to create (enroll) a Student in the `students-internal` plugin.

Base path
 - All endpoints are mounted under: /api/students-internal

Create student (enroll)
 - POST /api/students-internal/students

Request JSON body
 - userId (string) — required: id of the user (from auth service)
 - displayName (string) — optional

Example response
 - 201 Created with the created Student object (Prisma Student model)

Examples

curl example:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123","displayName":"Jane Doe"}' \
  http://localhost:4000/api/students-internal/students
```

Calling from another plugin (Nuxt / server-side) using $fetch:

```ts
// replace HOST:PORT with where the plugin server is running
await $fetch('http://localhost:4000/api/students-internal/students', {
  method: 'POST',
  body: {
    userId: 'user_123',
    displayName: 'Jane Doe',
  },
})
```

Notes
 - This plugin manages its own Prisma client and database; callers should not import or access the plugin DB directly.
 - Ensure the calling service includes any auth headers if you rely on auth in the plugin (the endpoint currently does not require auth).
