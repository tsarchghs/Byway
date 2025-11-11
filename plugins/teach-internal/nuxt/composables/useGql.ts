// Lightweight GraphQL fetch composable (plugin-scoped)
export async function gqlFetch<T=any>(endpoint: string, query: string, variables: any = {}, opts: { token?: string } = {}) : Promise<T> {
  const headers: Record<string,string> = { "Content-Type":"application/json" };
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    credentials: "include",
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e:any)=>e.message).join("; "));
  }
  return json.data;
}
