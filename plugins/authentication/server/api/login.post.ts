export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body?.email || 'demo@example.com')
  return { token: 'demo-token', user: { id:'u1', email, firstName:'Demo', lastName:'User' } }
})
