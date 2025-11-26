export async function resolveUser(req) {
  const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
  const auth = req.headers.authorization || ''
  try {
    const resp = await fetch(`${baseUrl}/api/authentication/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify({ query: `query Me { me { id email displayName roles teacherProfileId } }` }),
    })
    const json = await resp.json().catch(() => null)
    const me = json?.data?.me || null
    if (!me) return null
    const roles = Array.isArray(me.roles) ? me.roles.slice() : []
    if (me.teacherProfileId && !roles.includes('teacher')) roles.push('teacher')
    return { id: me.id, email: me.email, roles, teacherProfileId: me.teacherProfileId || null }
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
  const studentId = ctx?.studentId || null
  const institutionId = ctx?.institutionId || null
  let role = ctx?.institutionRole || null
  if (!role && user?.id && institutionId && ctx?.req) {
    role = await resolveInstitutionRole(user.id, institutionId, ctx.req)
  }
  const isAdmin = role === 'admin'
  const isTeacher = role === 'teacher'
  const isStudent = role === 'student'

  switch (action) {
    case 'student-record.view':
      // ID must match the authenticated user; teachers/admins may view within institution scope
      if (studentId && user?.id && studentId === user.id) return true
      if (institutionId) return isTeacher || isAdmin
      return false
    case 'classroom.view':
      return Boolean(role)
    case 'classroom.edit':
      return isTeacher || isAdmin
    case 'course.view':
      if (!institutionId) return Boolean(user)
      return Boolean(role)
    case 'course.edit':
      return isTeacher || isAdmin
    case 'institution.admin':
      return isAdmin
    case 'institution.teacher':
      return isTeacher
    case 'institution.student':
      return isStudent
    case 'assignment.view':
      if (!institutionId) return Boolean(user)
      return isStudent || isTeacher || isAdmin
    case 'assignment.grade':
      return isTeacher || isAdmin
    case 'lab.run':
      return isStudent
    case 'lab.grade':
      return isTeacher || isAdmin
    default:
      return false
  }
}
