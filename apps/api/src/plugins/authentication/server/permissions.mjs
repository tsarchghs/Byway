import jwt from 'jsonwebtoken'
import { prisma } from './db/client.js'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function resolveUser(req) {
  const auth = req.headers.authorization || ''
  if (auth.startsWith('Bearer ')) {
    try {
      const token = auth.replace('Bearer ', '').trim()
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
      if (user) {
        const roles = []
        if (user.role) roles.push(user.role)
        if (user.teacherProfileId) roles.push('teacher')
        return { id: user.id, email: user.email, roles }
      }
    } catch {}
  }
  return null
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
    case 'institution.admin':
      return isAdmin
    case 'institution.teacher':
      return isTeacher
    case 'institution.student':
      return isStudent
    default:
      return Boolean(user)
  }
}