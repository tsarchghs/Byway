import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const user = ref<any>(null)
const token = ref<string | null>(null)

// Only access localStorage on client
if (typeof window !== 'undefined') {
  token.value = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')
  if (savedUser) user.value = JSON.parse(savedUser)
}
watchEffect(() => {
  if (typeof window !== 'undefined') {
    token.value = localStorage.getItem('token')
    const saved = localStorage.getItem('user')
    user.value = saved ? JSON.parse(saved) : null
  }
})

export function useAuth() {
  const router = useRouter()
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function login(data: { token: string; user: any }) {
    if (typeof window === 'undefined') return
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    token.value = data.token
    user.value = data.user
  }

  function logout() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
      token.value = localStorage.getItem('token')
      const saved = localStorage.getItem('user')
      user.value = saved ? JSON.parse(saved) : null
    })
  }

  return { user, token, isLoggedIn, login, logout, redirectIfAuthenticated }
}
