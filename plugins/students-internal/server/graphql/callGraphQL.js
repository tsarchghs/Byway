import fetch from "node-fetch";
export async function callGraphQL(endpoint, query, variables = {}, headers = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) {
    const msg = json.errors.map(e => e.message).join("; ");
    throw new Error(msg || "GraphQL error");
  }
  return json.data;
}
