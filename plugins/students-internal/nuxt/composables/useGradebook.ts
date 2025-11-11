export function useGradebook(endpoint = '/api/students-internal/graphql') {
  async function call(query: string, variables: any = {}) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      credentials: 'include'
    })
    const json = await res.json()
    if (json.errors) throw new Error(json.errors.map((e:any)=>e.message).join('; '))
    return json.data
  }

  return {
    async list(courseId: string) {
      const q = `query($courseId:ID!){ courseGradebook(courseId:$courseId){ id assignmentId studentId courseId grade feedback updatedAt } }`
      const d = await call(q, { courseId })
      return d?.courseGradebook || []
    },
    async upsert(entry: {id?:string, assignmentId:string, studentId:string, courseId:string, grade?: number, feedback?: string}) {
      const m = `mutation($input:GradebookInput!){ upsertGrade(input:$input){ id assignmentId studentId courseId grade feedback updatedAt } }`
      const d = await call(m, { input: entry })
      return d?.upsertGrade
    }
  }
}
