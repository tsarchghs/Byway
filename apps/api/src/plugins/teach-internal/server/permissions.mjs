function getBaseUrl(req) {
  try {
    const protoRaw = req?.protocol || 'http'
    const hostRaw = (req && typeof req.get === 'function' && req.get('host')) || process.env.API_HOST || 'localhost:4000'
    const proto = String(protoRaw).startsWith('http') ? String(protoRaw).replace(/\/+$/, '') : `${protoRaw}://`
    const base = String(proto).includes('://') ? `${proto}${hostRaw}` : `${proto}://${hostRaw}`
    return base.replace(/\/$/, '')
  } catch {
    const fallback = process.env.API_BASE_URL || 'http://localhost:4000'
    return fallback.replace(/\/$/, '')
  }
}

export async function resolveUser(req) {
  const baseUrl = getBaseUrl(req)
  const auth = req.headers.authorization || ''
  const cookie = req.headers.cookie || ''
  console.log("HERE")
  try {
    const resp = await fetch(`localhost:4000/api/authentication/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({ query: `query Me { me { id email displayName roles teacherProfileId } }` }),
    })
    const json = await resp.json().catch(() => null)
    console.log({json})
    const me = json?.data?.me || null
    if (!me) return null
    const roles = Array.isArray(me.roles) ? me.roles.slice() : []
    if (me.teacherProfileId && !roles.includes('teacher')) roles.push('teacher')
    return { id: me.id, email: me.email, roles, teacherProfileId: me.teacherProfileId || null }
  } catch(e) { console.log(e);return null }
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
  const course = ctx?.course || null
  const institutionId = ctx?.institutionId || null
  let role = ctx?.institutionRole || null
  if (!role && user?.id && institutionId && ctx?.req) {
    role = await resolveInstitutionRole(user.id, institutionId, ctx.req)
  }
  const isAdmin = role === 'admin'
  const isTeacher = role === 'teacher'
  const isStudent = role === 'student'
  const ownsCourse = Boolean(course && user?.id && course.teacherId === user.id)

  switch (action) {
    case 'classroom.view':
      return Boolean(role)
    case 'classroom.edit':
      return isTeacher || isAdmin
    case 'course.view':
      return Boolean(user)
    case 'course.edit':
      if (ownsCourse) return true
      if (institutionId) return isTeacher || isAdmin
      // Allow standalone teachers (have teacher profile or role) to create/manage non-institution courses
      return isTeacher || isAdmin || Boolean(user?.teacherProfileId)
    case 'institution.admin':
      return isAdmin
    case 'institution.teacher':
      return isTeacher
    case 'institution.student':
      return isStudent
    case 'assignment.view':
      if (!institutionId) return Boolean(user)
      return isStudent || isTeacher || isAdmin
    case 'assignment.submit':
      return isStudent
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

export async function canAccessCourse(user, ctx) {
  if (!user?.id) return false
  const req = ctx?.req
  if (!req) return false
  const baseUrl = (req.protocol + '://' + req.get('host')).replace(/\/$/, '')
  const auth = req.headers.authorization || ''
  const courseId = String(ctx?.courseId || '').trim()
  const institutionId = ctx?.institutionId || null
  const classroomIds = Array.isArray(ctx?.classroomIds) ? ctx.classroomIds : []
  let isEnrolled = false
  try {
    const enrResp = await fetch(`${baseUrl}/api/students-internal/api/student-courses?studentId=${encodeURIComponent(user.id)}&courseId=${encodeURIComponent(courseId)}`, { headers: { ...(auth ? { Authorization: auth } : {}) } })
    const enrJson = enrResp && (await enrResp.json().catch(() => null))
    isEnrolled = Array.isArray(enrJson?.data) ? enrJson.data.some((x) => String(x.courseId) === String(courseId)) : false
  } catch {}
  let hasBought = false
  try {
    const purResp = await fetch(`${baseUrl}/api/ecommerce/purchases?userId=${encodeURIComponent(user.id)}&courseId=${encodeURIComponent(courseId)}`, { headers: { ...(auth ? { Authorization: auth } : {}) } })
    const purJson = purResp && (await purResp.json().catch(() => null))
    hasBought = Array.isArray(purJson?.data) ? purJson.data.some((p) => String(p.courseId) === String(courseId)) : false
  } catch {}
  let role = null
  if (institutionId) {
    role = await resolveInstitutionRole(user.id, institutionId, req)
  }
  let inClassroom = false
  if (classroomIds.length > 0 && institutionId) {
    try {
      const query = `query($institutionId:String){ classrooms(institutionId:$institutionId){ id enrollments{ studentId status } } }`
      const resp = await fetch(`${baseUrl}/api/institutions/graphql`, { method: 'POST', headers: { 'content-type': 'application/json', ...(auth ? { Authorization: auth } : {}) }, body: JSON.stringify({ query, variables: { institutionId } }) })
      const json = resp && (await resp.json().catch(() => null))
      const rooms = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
      inClassroom = classroomIds.some((cid) => {
        const room = rooms.find((r) => r.id === cid)
        if (!room) return false
        const enrollments = Array.isArray(room.enrollments) ? room.enrollments : []
        return enrollments.some((en) => en.studentId === user.id && String(en.status || '').toUpperCase() !== 'REMOVED')
      })
    } catch {}
  }
  return Boolean(isEnrolled || hasBought || (institutionId && (role === 'teacher' || role === 'admin')) || inClassroom)
}
