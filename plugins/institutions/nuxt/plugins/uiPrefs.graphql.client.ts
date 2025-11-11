// Auto-generated: UI Prefs via GraphQL (no localStorage)
// Registers a composable `useUiPrefs` that reads/writes prefs on /api/authentication/graphql
import { ref } from 'vue'

type Json = any

function gql(body: string, variables: any = {}, token?: string) {
  return fetch('/api/authentication/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query: body, variables }),
    credentials: 'include',
  }).then(r => r.json()).then(j => {
    if (j.errors) throw new Error(j.errors.map((e:any)=>e.message).join('; '))
    return j.data
  })
}

export default defineNuxtPlugin((_nuxtApp) => {
  const cache = ref<Record<string, any>>({})

  async function ensure(token?: string) {
    if (Object.keys(cache.value).length) return cache.value
    try {
      const data = await gql(`query { me { id role uiPrefs } }`, {}, token)
      cache.value = (data?.me?.uiPrefs || {}) as Record<string, any>
    } catch (e) {
      cache.value = {}
    }
    return cache.value
  }

  async function getPref(key: string, fallback?: any, token?: string) {
    const prefs = await ensure(token)
    return (prefs && key in prefs) ? prefs[key] : fallback
  }

  async function setPref(key: string, value: any, token?: string) {
    const prefs = await ensure(token)
    const next = { ...prefs, [key]: value }
    await gql(`mutation($prefs: JSON!) { setMyUiPrefs(prefs: $prefs) }`, { prefs: next }, token)
    cache.value = next
    return true
  }

  async function setRole(role: string, token?: string) {
    await gql(`mutation($role:String!){ setMyRole(role:$role) }`, { role }, token)
    return true
  }

  return {
    provide: {
      uiPrefs: {
        ensure,
        get: getPref,
        set: setPref,
        setRole,
        state: cache
      }
    }
  }
})
