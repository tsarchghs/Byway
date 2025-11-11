
import { ref } from 'vue'

type UiPrefs = Record<string, any>

const prefs = ref<UiPrefs>({})
const loaded = ref(false)

async function gql(endpoint: string, query: string, variables?: any) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message || 'GraphQL error')
  return json.data
}

async function loadPrefs() {
  if (loaded.value) return
  try {
    const data = await gql('/api/authentication/graphql', `query { myUiPrefs }`)
    const p = data?.myUiPrefs
    prefs.value = (typeof p === 'string' ? JSON.parse(p) : p) || {}
    loaded.value = true
  } catch {
    prefs.value = {}
  }
}

async function setPref(key:string, value:any) {
  await loadPrefs()
  const next = { ...prefs.value, [key]: value }
  await gql('/api/authentication/graphql', `mutation ($json:String!){ setMyUiPrefs(json:$json){ ok } }`, { json: JSON.stringify(next) })
  prefs.value = next
}

export function useUiPrefs() {
  return { prefs, loadPrefs, setPref }
}
