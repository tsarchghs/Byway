import { createApolloClient } from '../../../packages/shared-apollo/client'
import { DefaultApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  // Detect plugin from route: e.g. /plugins/authentication/login
  const route = useRoute()
  const segments = route.path.split('/')
  const pluginName = segments.includes('plugins')
    ? segments[segments.indexOf('plugins') + 1]
    : 'authentication' // fallback

  const apolloClient = createApolloClient(pluginName)
  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient)
})
