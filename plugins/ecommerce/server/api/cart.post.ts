export default defineEventHandler(async (event) => {
  const item = await readBody(event)
  return { ok:true, item }
})
