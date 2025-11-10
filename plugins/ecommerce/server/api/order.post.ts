export default defineEventHandler(async (event) => {
  const input = await readBody(event)
  const sum = (input?.items || []).reduce((s:any,i:any)=> s + (i.price||0)*(i.qty||1), 0)
  if (Math.abs(sum - (input?.total||0)) > 0.01) throw createError({ statusCode:400, statusMessage:'Total mismatch' })
  return { ok:true, orderId: Date.now() }
})
