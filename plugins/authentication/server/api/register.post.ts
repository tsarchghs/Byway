export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return { token: 'demo-token', user: { id:'u1', ...body } }
})
