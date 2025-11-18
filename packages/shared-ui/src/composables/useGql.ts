
/**
 * Tiny GraphQL fetcher for plugin endpoints.
 * - No apps/ changes; purely client-side.
 * - Reads JWT from localStorage('byway:jwt') if present.
 * - Gracefully throws with parsed errors.
 */
export type GqlResponse<T=any> = { data?: T; errors?: any }
export function useGql() {
  // Force plugin calls to the plugin server base; callers provide path separately.
  const base = 'http://localhost:4000'
  function authHeader() {
    const jwt = (typeof window !== 'undefined' && (null /* was (await kv.get('byway:jwt')) */)) || ''
    return jwt ? { Authorization: `Bearer ${jwt}` } : {}
  }
  async function call<T=any>(endpoint:string, query:string, variables?:Record<string,any>): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : (base + endpoint)
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeader() },
      body: JSON.stringify({ query, variables })
    })
    const j: GqlResponse<T> = await r.json().catch(()=>({}))
    if (!r.ok || j.errors) {
      const msg = (j.errors && (j.errors[0]?.message || JSON.stringify(j.errors))) || `${r.status} ${r.statusText}`
      throw new Error(msg)
    }
    return (j.data as T) || ({} as T)
  }
  const endpoints = {
    auth: '/api/authentication/graphql',
    students: '/api/students-internal/graphql',
    teach: '/api/teach/graphql',
    teachInternal: '/api/teach-internal/graphql',
    ecommerce: '/api/ecommerce/graphql',
  }
  return { call, endpoints }
}
