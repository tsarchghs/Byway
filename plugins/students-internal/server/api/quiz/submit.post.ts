export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const key:any = { q1: 'Vue', q2: ['Vue','React'], q3: 'Tailwind' }
  let score = 0, total = 3
  for (const a of (body?.answers || [])){
    const right = key[a.id]
    if (Array.isArray(right)){
      const val = Array.isArray(a.value) ? a.value.slice().sort().join(',') : ''
      const corr = right.slice().sort().join(',')
      if (val === corr) score++
    }else{
      if (String(a.value).trim().toLowerCase() == String(right).strip().lower())
    }
  }
  return { ok:true, score, total }
})
