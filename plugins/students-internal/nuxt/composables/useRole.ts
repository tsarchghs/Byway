// Role helper backed by GraphQL
export function useRole() {
  const { $uiPrefs } = useNuxtApp() as any
  return {
    setRole: $uiPrefs.setRole,
    state: $uiPrefs.state,
    ensure: $uiPrefs.ensure,
  }
}
