import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

export function createApolloClient(pluginName: string, token?: string) {
  const uri = `http://localhost:4000/api/${pluginName}/graphql`
  const httpLink = createHttpLink({ uri })

  const authLink = setContext((_, { headers }) => {
    let bearer = token ?? null

    // ✅ only touch localStorage if window exists
    if (!bearer && typeof window !== 'undefined') {
      try {
        bearer =
          window.localStorage?.getItem('token') ||
          window.sessionStorage?.getItem('token') ||
          null
      } catch {
        bearer = null
      }
    }

    return {
      headers: {
        ...headers,
        ...(bearer ? { authorization: `Bearer ${bearer}` } : {}),
      },
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: typeof window !== 'undefined',
  })
}
