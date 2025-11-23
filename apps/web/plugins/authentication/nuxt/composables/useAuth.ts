import { ref, computed, onMounted } from 'vue'

type Me = {
  id: string
  email: string
  displayName?: string | null
  roles?: string[] | null
}

const qMe = `query { me { id email displayName roles } }`

export function useAuth() {
  const me = ref<Me | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh(jwt?: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/authentication/graphql', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(jwt ? { authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({ query: qMe }),
        credentials: 'include'
      })
      const j = await res.json()
      if (j.errors) throw new Error(j.errors.map((e:any)=>e.message).join('; '))
      me.value = j?.data?.me ?? null
    } catch (e:any) {
      error.value = (e as any)?.message || String(e)
      me.value = null
    } finally {
      loading.value = false
    }
  }

  const isLoggedIn = computed(() => !!me.value?.id)
  const roles = computed<string[]>(() => (me.value?.roles || []) as string[])
  const isStudent = computed(() => roles.value.includes('student'))
  const isTeacher = computed(() => roles.value.includes('teacher'))
  const isInstitutionAdmin = computed(() => roles.value.includes('institution_admin'))

  onMounted(() => refresh())

  return { me, loading, error, isLoggedIn, isStudent, isTeacher, isInstitutionAdmin, roles, refresh }
}
