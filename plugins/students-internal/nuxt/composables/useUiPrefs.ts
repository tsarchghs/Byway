// packages/shared-ui/src/composables/useUiPrefs.ts
// A lightweight GraphQL-backed preference store (replaces localStorage).
import { ref } from 'vue'

type Prefs = Record<string, any>
const prefs = ref<Prefs>({})
let loaded = false
let loading: Promise<void> | null = null

const API = (path: string) => (typeof window !== 'undefined' ? `${window.location.origin}${path}` : path)

async function ensureLoaded() {
  if (loaded) return
  if (loading) return loading
  loading = (async () => {
    try {
      const resp = await fetch(API('/api/authentication/graphql'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: 'query{ uiPrefs }' }),
      })
      const json = await resp.json()
      const uiPrefs = json?.data?.uiPrefs || {}
      prefs.value = uiPrefs
    } catch (e) {
      // ignore
    } finally {
      loaded = true
      loading = null
    }
  })()
  return loading
}

export function useUiPrefs() {
  async function get(key: string) {
    await ensureLoaded()
    return prefs.value?.[key]
  }
  function getSync(key: string) {
    return prefs.value?.[key]
  }
  async function set(key: string, value: any) {
    await ensureLoaded()
    const resp = await fetch(API('/api/authentication/graphql'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        query: 'mutation($key:String!,$value:JSON!){ setUiPref(key:$key, value:$value){ uiPrefs } }',
        variables: { key, value }
      }),
    })
    const json = await resp.json()
    const ui = json?.data?.setUiPref?.uiPrefs || {}
    prefs.value = ui
    return ui[key]
  }
  async function setMany(patch: Record<string, any>) {
    await ensureLoaded()
    const resp = await fetch(API('/api/authentication/graphql'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        query: 'mutation($patch:JSON!){ setUiPrefs(patch:$patch){ uiPrefs } }',
        variables: { patch }
      }),
    })
    const json = await resp.json()
    const ui = json?.data?.setUiPrefs?.uiPrefs || {}
    prefs.value = ui
    return ui
  }
  return { get, getSync, set, setMany, ensureLoaded, state: prefs }
}
