import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// GraphQL-backed "me" fetcher
async function fetchMe() {
  try {
    const resp = await fetch((typeof window !== 'undefined' ? window.location.origin : '') + '/api/authentication/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query: 'query{ me { id email firstName lastName role avatarUrl uiPrefs } }' }),
    })
    const json = await resp.json()
    user.value = json?.data?.me || null
    return user.value
  } catch {
    user.value = null
  }
}

const user = ref<any>(null)
const token = ref<string | null>(null)

// Only access localStorage on client
if (typeof window !== 'undefined') {
  token.value = (null /* was localStorage.getItem('token') */)
  const savedUser = (null /* was localStorage.getItem('user') */)
  if (savedUser) user.value = JSON.parse(savedUser)
}
watchEffect(() => {
  if (typeof window !== 'undefined') {
    token.value = (null /* was localStorage.getItem('token') */)
    const saved = (null /* was localStorage.getItem('user') */)
    user.value = saved ? JSON.parse(saved) : null
  }
})

export function useAuth() {
  const router = useRouter()
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function login(data: { token: string; user: any }) {
    if (typeof window === 'undefined') return
    (void 0 /* was localStorage.setItem('token', data.token) */)
    (void 0 /* was localStorage.setItem('user', JSON.stringify(data.user) */))
    token.value = data.token
    user.value = data.user
  }

  function logout() {
    if (typeof window === 'undefined') return
    (void 0 /* was localStorage.removeItem('token') */)
    (void 0 /* was localStorage.removeItem('user') */)
    token.value = null
    user.value = null
    router.push('/auth/login')
  }

  function redirectIfAuthenticated() {
    if (isLoggedIn.value) router.push('/')
  }

  // Keep reactive sync if storage changes from another tab
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', () => {
      token.value = (null /* was localStorage.getItem('token') */)
      const saved = (null /* was localStorage.getItem('user') */)
      user.value = saved ? JSON.parse(saved) : null
    })
  }

  return { user, token, isLoggedIn, login, logout, redirectIfAuthenticated }
}
