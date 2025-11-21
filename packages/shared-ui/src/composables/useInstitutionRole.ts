import { ref, computed, watchEffect } from 'vue'
import { useAuth } from './useAuth'

export function useInstitutionRole(institutionId?: string | (() => string | null) | { value?: string | null }) {
  const auth = useAuth()
  const currentRole = ref<'none' | 'student' | 'teacher' | 'admin'>('none')
  const resolvedInstitutionId = computed(() => {
    if (!institutionId) return null
    if (typeof institutionId === 'string') return institutionId
    if (typeof institutionId === 'function') return institutionId() || null
    return (institutionId as any)?.value || null
  })

  async function refresh() {
    try {
      const id = resolvedInstitutionId.value
      const token = auth.token.value || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
      if (!id || !token) return
      const base = typeof window !== 'undefined' ? window.location.origin.replace(/\/$/, '') : ''
      const resp = await fetch(`${base}/api/institutions/graphql`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: `query($institutionId:String!){ members(institutionId:$institutionId){ userId role } }`, variables: { institutionId: id } }),
      })
      const json = await resp.json().catch(() => null)
      const arr = Array.isArray(json?.data?.members) ? json.data.members : []
      const uid = auth.user.value?.id || null
      const mem = arr.find((m: any) => m.userId === uid)
      const role = String(mem?.role || '').toLowerCase()
      if (role.includes('admin')) currentRole.value = 'admin'
      else if (role.includes('teach')) currentRole.value = 'teacher'
      else if (role.includes('student')) currentRole.value = 'student'
      else currentRole.value = 'none'
    } catch {}
  }

  watchEffect(() => { refresh() })

  const isAdmin = computed(() => currentRole.value === 'admin')
  const isTeacher = computed(() => currentRole.value === 'teacher')
  const isStudent = computed(() => currentRole.value === 'student')

  return { currentRole, isAdmin, isTeacher, isStudent, refresh }
}