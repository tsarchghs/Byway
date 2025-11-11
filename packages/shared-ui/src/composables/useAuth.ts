import { ref, computed } from 'vue'

const user = ref<any | null>(null)
const token = ref<string | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  function login(payload: { user: any; token: string }) {
    user.value = payload.user
    token.value = payload.token
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Restore session from storage (for SSR-safe check)
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch {
        user.value = null
      }
    }
  }

  return { user, token, isLoggedIn, login, logout }
}
