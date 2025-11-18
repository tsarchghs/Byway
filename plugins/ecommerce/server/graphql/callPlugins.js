export async function callGraphQL(path, query, variables = {}, token) {
  const res = await fetch(`http://localhost:4000${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'GraphQL error')
  return json.data
}
