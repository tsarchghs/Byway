async function post(apiPath, query, variables){
  const res = await fetch(`http://localhost:4000${apiPath}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) })
  const json = await res.json().catch(()=>null)
  if(!json||json.errors) throw new Error('sdk request failed')
  return json.data
}

export const sdk = {
  courses: {
    async list(){
      const data = await post('/api/teach-internal/graphql', `query { courses { id title category difficulty price discount coverUrl teacherId } }`, {})
      return Array.isArray(data?.courses) ? data.courses : []
    },
    async get(id){
      const data = await post('/api/teach-internal/graphql', `query($id:String!){ course(id:$id){ id title category difficulty description price discount coverUrl teacherId createdAt updatedAt } }`, { id })
      return data?.course || null
    }
  }
}