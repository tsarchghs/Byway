import { ref, computed } from 'vue'

const user = ref<any | null>(null)
const token = ref<string | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  const roleList = computed<string[]>(() => {
    const roles = user.value?.roles
    if (Array.isArray(roles))
      return roles.map(r => String(r))
    return []
  })

  const isStudent = computed(() => roleList.value.some(role => role.toLowerCase().includes('student')))
  const isTeacher = computed(() => roleList.value.some(role => role.toLowerCase().includes('teacher')))
  const isInstitutionAdmin = computed(() =>
    roleList.value.some(role =>
      role.toLowerCase().includes('admin') ||
      role.toLowerCase().includes('institution_admin') ||
      role.toLowerCase().includes('institution-admin'),
    ),
  )

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

  return {
    user,
    me: user,
    token,
    isLoggedIn,
    login,
    logout,
    isStudent,
    isTeacher,
    isInstitutionAdmin,
  }
}
