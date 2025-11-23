import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { provideApolloClient } from '@vue/apollo-composable'
import { useRoute, useRuntimeConfig } from '#imports'
import { useKV } from '../plugins/students-internal/nuxt/composables/useKV'

/**
 * Creates a dynamic Apollo Client that automatically points to
 * /api/<pluginName>/graphql based on the current route or a manual name.
 *
 * ✅ Works across all plugin microservices.
 * ✅ Includes JWT from localStorage or KV.
 * ✅ Auto-provides Apollo context for @vue/apollo-composable hooks.
 */
export async function useApolloPluginClient(manualName?: string) {
  const route = useRoute()
  const config = useRuntimeConfig()

  // Lazy-import useKV only when we’re inside Nuxt runtime
  let token: string | null = null
  if (typeof window !== 'undefined') {
    try {
      const kv = useKV()
      token = await kv.get('token')
    } catch {
      token = localStorage.getItem('token')
    }
  }

  // 1️⃣ Detect plugin name
  let pluginName = manualName
  if (!pluginName && route.path.startsWith('/plugins/')) {
    const parts = route.path.split('/')
    pluginName = parts[2] // e.g. /plugins/authentication/... → "authentication"
  }

  // 2️⃣ Build endpoint URL
  const apiBase = config.public.apiBase || 'http://localhost:4000'
  const uri = pluginName
    ? `${apiBase}/api/${pluginName}/graphql`
    : `${apiBase}/api/graphql`

  // 3️⃣ Setup links
  const httpLink = createHttpLink({ uri })
  const authLink = setContext((_, { headers }) => ({
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  }))

  // 4️⃣ Create Apollo instance
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  // 5️⃣ Provide globally for useQuery / useMutation
  provideApolloClient(apolloClient)
  return apolloClient
}
