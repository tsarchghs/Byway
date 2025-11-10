export default defineEventHandler(async (event) => {
  const now = Date.now()
  return { items: [
    { code:'BYW-001', courseId:'demo-1', courseTitle:'Demo Course 1', issuedAt: now - 86400000 },
    { code:'BYW-002', courseId:'demo-2', courseTitle:'Demo Course 2', issuedAt: now - 12*86400000 }
  ] }
})
