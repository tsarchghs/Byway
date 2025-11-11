// Auto-added by Byway patch: derive user role via GraphQL (ephemeral, no localStorage)
import { ref } from 'vue'
import { studentsGql } from './useGql'

const roleRef = ref<string>('guest')
let loaded = false

export async function useRole() {
  if (!loaded) {
    try {
      const data = await studentsGql<{ meRole: string }>(`query { meRole }`)
      roleRef.value = data?.meRole || 'guest'
    } catch (e) {
      roleRef.value = 'guest'
    } finally {
      loaded = true
    }
  }
  return roleRef
}
