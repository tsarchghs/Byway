export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  const ok = ['BYW-001','BYW-002'].includes(code)
  if (!ok) return { ok:false }
  return { ok:true, code, student:'Demo User', courseTitle: code==='BYW-001' ? 'Demo Course 1' : 'Demo Course 2', issuedAt: Date.now() - 7*86400000 }
})
