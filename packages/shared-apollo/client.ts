import { useKV } from '~/composables/useKV';
const kv = useKV();
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

export function createApolloClient(pluginName: string) {
  const httpLink = new HttpLink({
    uri: `http://localhost:4000/api/${pluginName}/graphql`,
  })

  const authLink = setContext((_, { headers }) => {
    const token = (null /* was (await kv.get('token')) */)
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })
}
