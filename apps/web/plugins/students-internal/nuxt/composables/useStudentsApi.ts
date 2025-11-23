export function useStudentsApi(base = 'http://localhost:4001/api/students-internal/graphql'){
  async function gql<T>(query:string, variables?:Record<string,any>):Promise<T>{
    const r = await fetch(base, {
      method:'POST',
      credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ query, variables })
    })
    const j = await r.json(); if (j.errors?.length) throw new Error(j.errors[0].message)
    return j.data as T
  }
  return { gql }
}
