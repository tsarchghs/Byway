// composables/useGraphQL.ts
export function useGraphQL(endpoint: string = '/api/graphql'){
  async function query<T=any>(q: string, variables: any = {}): Promise<T> {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: q, variables })
    })
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data
  }
  return { query }
}
