import { useApolloClient, gql } from '@vue/apollo-composable';

const KV_GET = gql`query KvGet($key: String!) { kvGet(key: $key) { key value } }`;
const KV_SET = gql`mutation KvSet($key: String!, $value: String) { kvSet(key:$key, value:$value) { key value } }`;
const KV_DELETE = gql`mutation KvDelete($key: String!) { kvDelete(key:$key) }`;

export function useKV() {
  const { client } = useApolloClient();
  async function get(key: string) {
    const { data } = await client.query({ query: KV_GET, variables: { key }, context: { uri: '/api/students-internal/graphql' } });
    return data?.kvGet?.value ?? null;
  }
  async function set(key: string, value: string | null) {
    const { data } = await client.mutate({ mutation: KV_SET, variables: { key, value }, context: { uri: '/api/students-internal/graphql' } });
    return data?.kvSet?.value ?? null;
  }
  async function del(key: string) {
    const { data } = await client.mutate({ mutation: KV_DELETE, variables: { key }, context: { uri: '/api/students-internal/graphql' } });
    return !!data?.kvDelete;
  }
  return { get, set, del };
}
