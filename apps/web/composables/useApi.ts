export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase
  const api = $fetch.create({ baseURL: base })
  return api
}
