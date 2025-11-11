// Removed localStorage shim in favor of GraphQL prefs.
// This file remains to avoid import breakage; it simply relies on uiPrefs.graphql.client.ts.
export default defineNuxtPlugin(() => {
  // no-op; see plugins/uiPrefs.graphql.client.ts
});