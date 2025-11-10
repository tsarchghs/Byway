export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = String(body?.code||'').toUpperCase().trim()
  const total = Number(body?.total||0)
  if (!code) return { ok:false, message:'Missing code', discount:0 }
  const coupons:any = { 'BYWAY10': { kind:'percent', value:10 }, 'SAVE5': { kind:'amount', value:5 } }
  const c = coupons[code]
  if (!c) return { ok:false, message:'Invalid code', discount:0 }
  const discount = c.kind==='percent' ? Math.round(total * c.value)/100 : c.value
  return { ok:true, code, discount }
})
