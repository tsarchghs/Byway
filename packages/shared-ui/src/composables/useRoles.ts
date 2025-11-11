import { computed } from 'vue'
import { useAuth } from './useAuth'

/**
 * Lightweight role helper for UI gating.
 * Uses role on authenticated user; no localStorage.
 * Allowed: 'student' | 'teacher' | 'admin' | 'institution_admin' | 'dean'
 */
export function useRoles() {
  const auth = useAuth()
  const user = computed(() => auth.user.value as any)

  const role = computed<string>(() => {
    const u = user.value
    const fromUser = (u?.role || (Array.isArray(u?.roles) ? u.roles[0] : '') || '').toString().toLowerCase()
    return (fromUser || 'student') as string
  })

  async function setRole(newRole: string){
    try {
      const resp = await fetch((typeof window !== 'undefined' ? window.location.origin : '') + '/api/authentication/graphql', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          query: 'mutation($role:String!){ setMyRole(role:$role){ id role } }',
          variables: { role: newRole.toUpperCase() }
        })
      })
      const json = await resp.json()
      if (json?.data?.setMyRole){
        // Refresh auth.me on success
        await (auth as any).fetchMe?.()
      }
    } catch {}
  }

  const isStudent = computed(() => role.value === 'student')
  const isTeacher = computed(() => role.value === 'teacher')
  const isAdmin   = computed(() => role.value === 'admin' || role.value === 'institution_admin' || role.value === 'dean')

  return { role, isStudent, isTeacher, isAdmin, setRole }
}
