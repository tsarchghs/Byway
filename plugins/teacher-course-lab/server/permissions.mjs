export async function resolveUser(req) {
  const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
  const auth = req.headers.authorization || ''
  try {
    const resp = await fetch(`${baseUrl}/api/authentication/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify({ query: `query Me { me { id email displayName roles } }` }),
    })
    const json = await resp.json().catch(() => null)
    const me = json?.data?.me || null
    return me ? { id: me.id, email: me.email, roles: me.roles || [] } : null
  } catch { return null }
}

export async function resolveInstitutionRole(userId, institutionId, req) {
  if (!userId || !institutionId) return null
  const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
  const auth = req.headers.authorization || ''
  try {
    const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
      method: 'POST', headers: { 'content-type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify({ query: `query($institutionId:String!){ members(institutionId:$institutionId){ userId role } }`, variables: { institutionId } })
    })
    const json = await resp.json().catch(() => null)
    const members = Array.isArray(json?.data?.members) ? json.data.members : []
    const m = members.find((x) => x.userId === userId)
    if (!m) return null
    const r = String(m.role || '').toLowerCase()
    if (r.includes('admin')) return 'admin'
    if (r.includes('teach')) return 'teacher'
    if (r.includes('student')) return 'student'
    return null
  } catch { return null }
}

export async function canUser(action, ctx) {
  const user = ctx?.user || null
  const institutionId = ctx?.institutionId || null
  let role = ctx?.institutionRole || null
  if (!role && user?.id && institutionId && ctx?.req) {
    role = await resolveInstitutionRole(user.id, institutionId, ctx.req)
  }
  const isAdmin = role === 'admin'
  const isTeacher = role === 'teacher'
  const isStudent = role === 'student'

  switch (action) {
    case 'lab.run':
      return isStudent
    case 'lab.grade':
      return isTeacher || isAdmin
    case 'classroom.view':
      return Boolean(role)
    case 'assignment.view':
      return isStudent || isTeacher || isAdmin
    case 'assignment.grade':
      return isTeacher || isAdmin
    default:
      return false
  }
}