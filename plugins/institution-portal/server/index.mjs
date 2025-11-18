import express from 'express'
import cors from 'cors'

const apiBase = process.env.API_BASE || 'http://localhost:4000'

async function gql(path, query, variables, token) {
  const resp = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  const text = await resp.text()
  let json
  try {
    json = JSON.parse(text)
  } catch (e) {
    throw new Error(`Upstream ${path} returned non-JSON (status ${resp.status})`)
  }
  if (!resp.ok) throw new Error(json?.errors?.[0]?.message || `Request failed (${resp.status})`)
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

async function loadInstitutionBundle(inst, token) {
  const data = await gql(
    '/api/institutions/graphql',
    `query($id:String!){
      institution(id:$id){ id name slug type location email phone active }
      departments(institutionId:$id){ id name slug active institutionId head contact }
      classrooms(institutionId:$id){ id title code departmentId institutionId status capacity enrollments { id } }
      members(institutionId:$id){ id userId role status institutionId }
      stats(institutionId:$id){ classrooms activeClassrooms departments members students }
    }`,
    { id: inst.id },
    token
  )
  return {
    institution: data?.institution || inst,
    departments: (data?.departments || []).map((d) => ({ ...d, institutionId: inst.id })),
    classrooms: (data?.classrooms || []).map((c) => ({ ...c, enrollment: c.enrollments?.length || 0, institutionId: inst.id })),
    members: (data?.members || []).map((m) => ({ ...m, institutionId: inst.id })),
    stats: data?.stats || null,
  }
}

export async function register(app) {
  const router = express.Router()

  router.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

  // GET /api/institution-portal/overview (real aggregation)
  router.get('/overview', async (req, res) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
    if (!token) return res.status(401).json({ error: 'Missing token' })

    try {
      const meData = await gql(
        '/api/authentication/graphql',
        `query{ me { id email firstName lastName role roles } }`,
        {},
        token
      )
      const user = meData?.me || null

      const instData = await gql(
        '/api/institutions/graphql',
        `query{
          institutions { id name slug active type location email phone }
        }`,
        {},
        token
      )
      const institutions = instData?.institutions || []

      const bundles = await Promise.all(institutions.map((i) => loadInstitutionBundle(i, token)))
      const departments = bundles.flatMap((b) => b.departments)
      const classrooms = bundles.flatMap((b) => b.classrooms)
      const members = bundles.flatMap((b) => b.members)
      const stats = bundles.map((b) => ({ institutionId: b.institution.id, stats: b.stats }))

      res.json({ user, institutions, departments, classrooms, members, stats })
    } catch (err) {
      console.error('[institution-portal] overview error', err)
      res.status(500).json({ error: err?.message || 'Failed to load overview' })
    }
  })

  app.use('/api/institution-portal', router)
  console.log('[institution-portal] API ready at /api/institution-portal')
}
