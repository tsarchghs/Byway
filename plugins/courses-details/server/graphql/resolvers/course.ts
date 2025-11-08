// plugins/courses-internal/server/graphql/resolvers/course.ts
/**
 * This resolver proxies all data to other internal plugin APIs
 * so we always serve live data from the real Prisma source.
 */

async function queryPlugin(apiPath: string, query: string, variables = {}, token?: string) {
  const res = await fetch(`http://localhost:4000${apiPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

export const resolvers = {
  Query: {
    /**
     * Fetch one course with full nested data from teach-internal.
     */
    async course(_: any, { id }: { id: string }, ctx: any) {
      const token = ctx?.req?.headers?.authorization?.replace('Bearer ', '') || ''

      // 🔹 Query the real Prisma source via teach-internal
      const result = await queryPlugin(
        '/api/teach-internal/graphql',
        `query ($id: String!) {
          course(id: $id) {
            id
            title
            category
            difficulty
            description
            price
            discount
            coverUrl
            teacherId
            modules {
              id
              title
              lessons {
                id
                title
                duration
              }
            }
            createdAt
            updatedAt
          }
        }`,
        { id },
        token
      )

      return result.course
    },

    /**
     * List all courses (for dashboards, etc.)
     */
    async courses(_: any, _args: any, ctx: any) {
      const token = ctx?.req?.headers?.authorization?.replace('Bearer ', '') || ''
      const result = await queryPlugin(
        '/api/teach-internal/graphql',
        `query {
          courses {
            id
            title
            category
            difficulty
            price
            discount
            coverUrl
            teacherId
          }
        }`,
        {},
        token
      )
      return result.courses
    },

    /**
     * Validate coupon – delegate directly to teach-internal.
     */
    async validateCoupon(_: any, { courseId, code }: { courseId: string; code: string }) {
      const result = await queryPlugin(
        '/api/teach-internal/graphql',
        `query ($courseId: ID!, $code: String!) {
          validateCoupon(courseId: $courseId, code: $code) {
            percent
          }
        }`,
        { courseId, code }
      )
      return result.validateCoupon
    },
  },
}
