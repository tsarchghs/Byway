// Thin wrapper to GraphQL-backed uiPrefs provided by uiPrefs.graphql.client.ts
export function useUiPrefs() {
  const { $uiPrefs } = useNuxtApp() as any
  return $uiPrefs
}
