async function queryPlugin(apiPath, query, variables = {}, token){
  const res = await fetch(`http://localhost:4000${apiPath}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ query, variables }) })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

export const resolvers = {
  Query: {
    async course(_, { id }, ctx){
      const token = ctx?.req?.headers?.authorization?.replace('Bearer ', '') || ''
      const result = await queryPlugin('/api/teach-internal/graphql', `query ($id: String!) { course(id: $id) { id title category difficulty description price discount coverUrl teacherId modules { id title lessons { id title duration } } createdAt updatedAt } }`, { id }, token)
      return result.course
    },
    async courses(_, _args, ctx){
      const token = ctx?.req?.headers?.authorization?.replace('Bearer ', '') || ''
      const result = await queryPlugin('/api/teach-internal/graphql', `query { courses { id title category difficulty price discount coverUrl teacherId } }`, {}, token)
      return result.courses
    },
    async validateCoupon(_, { courseId, code }){
      const result = await queryPlugin('/api/teach-internal/graphql', `query ($courseId: ID!, $code: String!) { validateCoupon(courseId: $courseId, code: $code) { percent } }`, { courseId, code })
      return result.validateCoupon
    }
  }
}