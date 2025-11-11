/**
 * GraphQL-backed localStorage bridge (safe, surgical)
 * - Reads/writes UI prefs via /api/authentication/graphql
 * - Keeps a small in-memory cache and mirrors into native localStorage for offline tolerance
 */
// @ts-nocheck
export default defineNuxtPlugin(() => {
  const endpoint = '/api/authentication/graphql'
  const cache = new Map<string, string | null>()
  let initialized = false

  async function gql(query: string, variables: Record<string, any> = {}) {
    const headers: any = { 'content-type': 'application/json' }
    const token = (globalThis as any).__AUTH_TOKEN || ''
    if (token) headers['authorization'] = `Bearer ${token}`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    })
    const j = await res.json().catch(() => ({}))
    if (j.errors) throw new Error(j.errors.map((e:any)=>e.message).join('; '))
    return j.data
  }

  async function hydrate() {
    try {
      const data = await gql(`query Me { me { id uiPrefs } }`)
      const prefs = (data?.me?.uiPrefs) || {}
      Object.entries(prefs).forEach(([k,v]) => {
        const val = typeof v === 'string' ? v : JSON.stringify(v)
        cache.set(k, val)
        try { globalThis.localStorage?.setItem(k, val) } catch {}
      })
    } catch (e) {
      // ignore; offline mode
    } finally {
      initialized = true
    }
  }

  // Start hydration but don't block app
  // eslint-disable-next-line no-floating-promise
  hydrate()

  const original = { ...globalThis.localStorage }

  async function setPref(key: string, value: string) {
    cache.set(key, value)
    try { original.setItem?.(key, value) } catch {}
    try {
      await gql(
        `mutation SetUiPref($key:String!,$value:String!){ setUiPref(key:$key,value:$value) }`,
        { key, value }
      )
    } catch {}
  }

  // Proxy localStorage surgically
  try {
    const proxy = new Proxy(globalThis.localStorage, {
      get(target, prop, receiver) {
        if (prop === 'getItem') {
          return (key: string) => {
            if (cache.has(key)) return cache.get(key)
            try { return original.getItem?.(key) } catch {}
            return null
          }
        }
        if (prop === 'setItem') {
          return (key: string, value: string) => {
            // fire and forget; keep UI snappy
            // eslint-disable-next-line no-floating-promise
            setPref(key, value)
          }
        }
        return Reflect.get(target, prop, receiver)
      }
    })
    // @ts-ignore
    globalThis.localStorage = proxy
  } catch {}

  // Small helper
  ;(globalThis as any).__uiPrefs = {
    ready: () => initialized,
    get: (k: string, fallback: any = null) => cache.get(k) ?? fallback,
    set: (k: string, v: any) => setPref(k, typeof v === 'string' ? v : JSON.stringify(v)),
  }
})
