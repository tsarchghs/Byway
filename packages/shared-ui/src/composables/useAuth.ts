
import { ref, computed } from 'vue'
import { useRouter } from '#imports'

type User = { id: string; email?: string; firstName?: string; lastName?: string; roles?: string[] }

const currentUser = ref<User|null>(null)
const loading = ref(false)
const error = ref<string| null>(null)

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

async function fetchMe() {
  loading.value = true
  error.value = null
  try {
    const data = await gql('/api/authentication/graphql', `
      query { me { id email firstName lastName roles } }
    `)
    currentUser.value = data?.me || null
  } catch (e:any) {
    error.value = e?.message || String(e)
    currentUser.value = null
  } finally {
    loading.value = false
  }
}

async function login(email: string, password: string) {
  loading.value = true
  error.value = null
  try {
    const data = await gql('/api/authentication/graphql', `
      mutation ($email:String!,$password:String!) {
        login(email:$email,password:$password) { ok }
      }
    `, { email, password })
    await fetchMe()
    return data?.login?.ok === true
  } catch (e:any) {
    error.value = e?.message || String(e)
    return false
  } finally {
    loading.value = false
  }
}

async function logout() {
  try {
    await gql('/api/authentication/graphql', `mutation { logout { ok } }`)
  } catch {}
  currentUser.value = null
}

export function useAuth() {
  if (currentUser.value === null && !loading.value) {
    // try once on first use
    fetchMe()
  }
  const router = useRouter()
  const isLoggedIn = computed(() => !!currentUser.value?.id)
  const roles = computed(() => currentUser.value?.roles || [])

  return {
    user: currentUser,
    loading,
    error,
    isLoggedIn,
    roles,
    fetchMe,
    login,
    logout,
  }
}
