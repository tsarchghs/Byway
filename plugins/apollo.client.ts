import { createApolloClient } from '../packages/shared-apollo/client'
import { DefaultApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  // ✅ Only access localStorage on client side
  let token: string | null = null

  if (process.server) {
    // During SSR, use cookie
    const cookie = useCookie('byway_auth_token')
    token = cookie.value || null
  } else if (process.client) {
    // During client runtime, use localStorage
  }

  const apolloClient = createApolloClient('authentication', token || undefined)

  // ✅ Provide globally
  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient)
})
