import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

/**
 * Creates an Apollo Client instance for a given plugin API.
 * @param pluginName - e.g. "teach-internal", "students-internal"
 * @param token - optional Bearer token for authentication
 */
export function createApolloClient(pluginName: string, token?: string) {
  const httpLink = new HttpLink({
    uri: `http://localhost:4000/api/${pluginName}/graphql`,
  })

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }))

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })
}
