import express from 'express'
import cors from 'cors'
import { resolveUser, canUser } from './permissions.mjs'

const DEFAULT_CORS = ['http://localhost:3000', 'http://localhost:3001']
let cachedFetch = null

async function ensureFetch() {
  if (typeof fetch === 'function') return fetch
  if (!cachedFetch) {
    const mod = await import('node-fetch')
    cachedFetch = mod.default || mod
  }
  return cachedFetch
}

function normalizeBaseUrl(req) {
  const envUrl =
    process.env.APP_BASE_URL || process.env.PUBLIC_APP_URL || process.env.APP_BASE || ''
  if (envUrl) return envUrl.replace(/\/$/, '')
  const host = req?.get?.('host')
  if (!host) return ''
  const protocol = req?.protocol || 'http'
  return `${protocol}://${host}`.replace(/\/$/, '')
}

function flattenOverview(payload = []) {
  return payload.reduce(
    (acc, inst) => {
      const { departments = [], classrooms = [], members = [], ...rest } = inst || {}
      acc.institutions.push(rest)
      departments.forEach((dept) => acc.departments.push(dept))
      classrooms.forEach((room) => acc.classrooms.push(room))
      members.forEach((member) => acc.members.push(member))
      return acc
    },
    { institutions: [], departments: [], classrooms: [], members: [] },
  )
}

async function callGraphQL(fetchImpl, url, query, variables = {}, authHeader) {
  const resp = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })

  const text = await resp.text().catch(() => '')
  let json = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch (err) {
      throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 200)}`)
    }
  }

  if (!resp.ok) {
    throw new Error(
      (json && (json.error || json.message)) || `HTTP ${resp.status} from ${url}`,
    )
  }

  if (Array.isArray(json?.errors) && json.errors.length > 0) {
    throw new Error(json.errors.map((err) => err?.message).join('; '))
  }

  return json?.data || null
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (value == null) return []
  return [value]
}

export async function register(app) {
  const router = express.Router()
  router.use(async (req, _res, next) => { try { req.user = await resolveUser(req) } catch {} next() })
  const corsOrigins =
    process.env.PLUGIN_CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ||
    DEFAULT_CORS

  router.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  )

  router.get('/overview', async (req, res) => {
    const allowed = await canUser('course.view', { user: req.user })
    if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' })
    }

    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) {
      return res.status(500).json({ error: 'Unable to resolve API base URL' })
    }

    const gqlQuery = `
      query InstitutionPortalOverview {
        institutions {
          id
          name
          slug
          type
          location
          email
          phone
          active
          createdAt
          updatedAt
          departments {
            id
            institutionId
            name
            slug
            active
            createdAt
            updatedAt
          }
          classrooms {
            id
            institutionId
            departmentId
            teacherId
            title
            code
            capacity
            status
            startsAt
            endsAt
            enrollments {
              id
              studentId
              status
            }
            createdAt
            updatedAt
          }
          members {
            id
            institutionId
            userId
            role
            status
            createdAt
            updatedAt
          }
        }
      }
    `

    try {
      const fetchImpl = await ensureFetch()
      const upstream = await fetchImpl(`${baseUrl}/api/institutions/graphql`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ query: gqlQuery }),
      })

      if (!upstream.ok) {
        const text = await upstream.text().catch(() => '')
        throw new Error(`institutions responded ${upstream.status}: ${text}`)
      }

      const payload = await upstream.json()
      if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
        throw new Error(payload.errors.map((err) => err?.message).join('; '))
      }

      const flattened = flattenOverview(payload?.data?.institutions || [])
      return res.json(flattened)
    } catch (error) {
      console.error('[institution-portal] overview error', error)
      return res.status(502).json({ error: 'Failed to load overview' })
    }
  })

  router.get('/student-dashboard', async (req, res) => {
    if (!req.user?.id) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' })
    }

    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) {
      return res.status(500).json({ error: 'Unable to resolve API base URL' })
    }

    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) =>
      callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)

    const institutionIdParam = String(
      req.query.institutionId || req.query.institution_id || '',
    ).trim()
    const institutionSlugParam = String(
      req.query.institutionSlug || req.query.institution_slug || '',
    ).trim()

    const warn = (scope, err) =>
      console.warn(`[institution-portal] ${scope}`, err?.message || err)

    try {
      const meData = await gql(
        '/api/authentication/graphql',
        `
          query StudentMe {
            me {
              id
              email
              displayName
              firstName
              lastName
              role
              roles
              teacherProfileId
              createdAt
              updatedAt
            }
          }
        `,
      )

      const me = meData?.me
      if (!me?.id) {
        return res.status(401).json({ error: 'Unable to resolve current user via authentication' })
      }

      const studentLookupQuery = `
        query StudentByUser($userId:String!) {
          studentByUserId(userId:$userId) {
            id
            userId
            displayName
            createdAt
            updatedAt
          }
        }
      `

      const resolveStudent = async () => {
        try {
          const result = await gql('/api/students-internal/graphql', studentLookupQuery, {
            userId: me.id,
          })
          return result?.studentByUserId || null
        } catch (err) {
          warn('student lookup failed', err)
          return null
        }
      }

      let student = await resolveStudent()
      if (!student) {
        const displayName =
          me.displayName ||
          [me.firstName, me.lastName].filter(Boolean).join(' ').trim() ||
          me.email
        await fetchImpl(`${baseUrl}/api/students-internal/api/ensure-student`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            userId: me.id,
            displayName,
          }),
        }).catch((err) => warn('ensure-student failed', err))
        student = await resolveStudent()
      }

      const studentId = student?.id || null

      let institution = null
      if (institutionIdParam) {
        const data = await gql(
          '/api/institutions/graphql',
          `
            query ($id:String!) {
              institution(id:$id) {
                id
                name
                slug
                type
                location
                email
                phone
                active
                createdAt
                updatedAt
              }
            }
          `,
          { id: institutionIdParam },
        )
        institution = data?.institution || null
      } else if (institutionSlugParam) {
        const data = await gql(
          '/api/institutions/graphql',
          `
            query ($slug:String!) {
              institutionBySlug(slug:$slug) {
                id
                name
                slug
                type
                location
                email
                phone
                active
                createdAt
                updatedAt
              }
            }
          `,
          { slug: institutionSlugParam },
        )
        institution = data?.institutionBySlug || null
      } else {
        const data = await gql(
          '/api/institutions/graphql',
          `
            query {
              institutions {
                id
                name
                slug
                type
                location
                email
                phone
                active
                createdAt
                updatedAt
              }
            }
          `,
        )
        institution = asArray(data?.institutions)[0] || null
      }

      if (!institution?.id) {
        return res.status(404).json({ error: 'Institution not found' })
      }
      const role = await (await import('./permissions.mjs')).resolveInstitutionRole(me.id, institution.id, req)
      const allowed = await canUser('student-record.view', { user: req.user, role, studentId: me.id })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })

      const institutionId = institution.id
      const [deptData, classroomData, memberData] = await Promise.all([
        gql(
          '/api/institutions/graphql',
          `
            query ($institutionId:String!) {
              departments(institutionId:$institutionId) {
                id
                institutionId
                name
                slug
                contact
                head
                active
                createdAt
                updatedAt
              }
            }
          `,
          { institutionId },
        ),
        gql(
          '/api/institutions/graphql',
          `
            query ($institutionId:String!) {
              classrooms(institutionId:$institutionId) {
                id
                institutionId
                departmentId
                teacherId
                title
                code
                capacity
                status
                startsAt
                endsAt
                createdAt
                updatedAt
                enrollments {
                  id
                  studentId
                  status
                }
              }
            }
          `,
          { institutionId },
        ),
        gql(
          '/api/institutions/graphql',
          `
            query ($institutionId:String!) {
              members(institutionId:$institutionId) {
                id
                institutionId
                userId
                role
                status
                createdAt
                updatedAt
              }
            }
          `,
          { institutionId },
        ),
      ])

      const departments = asArray(deptData?.departments)
      const institutionClassrooms = asArray(classroomData?.classrooms)
      const members = asArray(memberData?.members)
      const membership = members.find((item) => item.userId === me.id) || null

      const departmentLookup = new Map()
      departments.forEach((dept) => {
        if (dept?.id) departmentLookup.set(dept.id, dept)
      })

      const classroomEnrollments = []
      const unifiedClassrooms = institutionClassrooms.map((room) => {
        const enrollmentsForRoom = asArray(room?.enrollments).map((enrollment) => ({
          id: enrollment.id,
          classroomId: room.id,
          studentId: enrollment.studentId,
          status: enrollment.status,
          createdAt: null,
          updatedAt: null,
        }))
        classroomEnrollments.push(...enrollmentsForRoom)
        const match = studentId
          ? enrollmentsForRoom.find((item) => item.studentId === studentId)
          : null

        return {
          id: room.id,
          title: room.title || room.code || 'Classroom',
          code: room.code || room.title || room.id,
          departmentId: room.departmentId || null,
          departmentName: room.departmentId ? departmentLookup.get(room.departmentId)?.name || null : null,
          institutionId: room.institutionId,
          capacity: room.capacity ?? null,
          status: room.status ?? null,
          startsAt: room.startsAt ?? null,
          endsAt: room.endsAt ?? null,
          courseId: null,
          courseTitle: null,
          isEnrolled: !!match,
          enrollmentStatus: match?.status || null,
          teacherId: room.teacherId ?? null,
        }
      })

      let courses = []
      let studentCourseEnrollments = []
      if (studentId) {
        try {
          const courseData = await gql(
            '/api/students-internal/graphql',
            `
              query ($studentId:String!) {
                myCourses(studentId:$studentId) {
                  id
                  studentId
                  courseId
                  progress
                  enrolledAt
                  completed
                  course {
                    id
                    title
                    category
                    difficulty
                    description
                    price
                    discount
                    coverUrl
                  }
                }
                enrollments(studentId:$studentId) {
                  id
                  studentId
                  courseId
                  progress
                  createdAt
                  updatedAt
                }
              }
            `,
            { studentId },
          )
          const rawCourses = asArray(courseData?.myCourses)
          studentCourseEnrollments = asArray(courseData?.enrollments)
          courses = rawCourses.map((entry) => ({
            courseId: entry.courseId,
            title: entry.course?.title || 'Course',
            category: entry.course?.category || null,
            difficulty: entry.course?.difficulty || null,
            description: entry.course?.description || null,
            price: entry.course?.price ?? 0,
            discount: entry.course?.discount ?? 0,
            coverUrl: entry.course?.coverUrl || null,
            progressPct: Math.round(entry.progress ?? 0),
            completed: !!entry.completed,
            gradePct: null,
            classroomCount: 0,
          }))
        } catch (err) {
          warn('student-dashboard courses error', err)
        }
      }

      const courseTitleMap = new Map()
      courses.forEach((course) => courseTitleMap.set(course.courseId, course.title))

      const gradebookEntries = []
      if (studentId && courses.length) {
        await Promise.allSettled(
          courses.map(async (course) => {
            if (!course.courseId) return
            try {
              const gradeData = await gql(
                '/api/students-internal/graphql',
                `
                  query ($courseId:ID!) {
                    courseGradebook(courseId:$courseId) {
                      id
                      assignmentId
                      studentId
                      courseId
                      grade
                      feedback
                      createdAt
                      updatedAt
                    }
                  }
                `,
                { courseId: course.courseId },
              )
              const entries = asArray(gradeData?.courseGradebook).filter(
                (entry) => entry.studentId === studentId,
              )
              gradebookEntries.push(
                ...entries.map((entry) => ({
                  ...entry,
                  courseTitle: courseTitleMap.get(entry.courseId) || null,
                })),
              )
              if (entries.length) {
                const avg =
                  entries.reduce((sum, entry) => sum + Number(entry.grade || 0), 0) /
                  entries.length
                course.gradePct = Math.round(avg)
              }
            } catch (err) {
              warn(`gradebook fetch failed for course ${course.courseId}`, err)
            }
          }),
        )
      }

      const submissionMap = new Map()
      if (studentId) {
        try {
          const submissionsData = await gql(
            '/api/teach-internal/graphql',
            `
              query ($studentId:String!) {
                mySubmissions(studentId:$studentId) {
                  id
                  assignmentId
                  studentId
                  grade
                  createdAt
                  updatedAt
                }
              }
            `,
            { studentId },
          )
          asArray(submissionsData?.mySubmissions).forEach((submission) => {
            if (submission?.assignmentId) submissionMap.set(submission.assignmentId, submission)
          })
        } catch (err) {
          warn('teach submissions fetch failed', err)
        }
      }

      const assignments = []
      if (institutionClassrooms.length) {
        const assignmentQuery = `
          query ($classroomId:String!) {
            assignmentsByClassroom(classroomId:$classroomId) {
              id
              classroomId
              title
              description
              dueDate
              createdAt
              updatedAt
            }
          }
        `
        await Promise.allSettled(
          institutionClassrooms.map(async (room) => {
            try {
              const assignmentData = await gql(
                '/api/teach-internal/graphql',
                assignmentQuery,
                { classroomId: room.id },
              )
              const list = asArray(assignmentData?.assignmentsByClassroom)
              list.forEach((assignment) => {
                const submission = submissionMap.get(assignment.id)
                const submissionStatus = submission
                  ? submission.grade != null
                    ? 'graded'
                    : 'submitted'
                  : 'not-submitted'
                assignments.push({
                  id: assignment.id,
                  title: assignment.title,
                  description: assignment.description,
                  classroomId: room.id,
                  classroomName: room.title || room.code || 'Classroom',
                  courseId: null,
                  courseTitle: null,
                  dueDate: assignment.dueDate,
                  acceptUntil: null,
                  maxAttempts: null,
                  latePenalty: null,
                  submissionStatus,
                  grade: submission?.grade ?? null,
                  isLate: null,
                })
              })
            } catch (err) {
              warn(`assignments fetch failed for classroom ${room.id}`, err)
            }
          }),
        )
      }

      let labs = []
      try {
        const labsData = await gql(
          '/api/teacher-course-lab/graphql',
          `
            query ($userId:String!) {
              tclab_sessionsByUser(userId:$userId) {
                id
                challengeId
                status
                codeServerUrl
                appUrl
                lastHeartbeat
                createdAt
                updatedAt
                challenge {
                  id
                  title
                  difficulty
                  runtime
                }
              }
            }
          `,
          { userId: me.id },
        )
        labs = asArray(labsData?.tclab_sessionsByUser).map((session) => ({
          sessionId: session.id,
          status: session.status,
          challengeId: session.challengeId,
          challengeTitle: session.challenge?.title || 'Lab challenge',
          difficulty: session.challenge?.difficulty || null,
          runtime: session.challenge?.runtime || null,
          courseId: null,
          courseTitle: null,
          codeServerUrl: session.codeServerUrl || null,
          appUrl: session.appUrl || null,
          lastHeartbeat: session.lastHeartbeat || null,
        }))
      } catch (err) {
        warn('lab sessions fetch failed', err)
      }

      let orders = []
      try {
        const ordersData = await gql(
          '/api/ecommerce/graphql',
          `
            query ($studentId:String) {
              myOrders(studentId:$studentId) {
                id
                studentId
                currency
                subtotal
                discount
                total
                status
                createdAt
                updatedAt
                items {
                  id
                  courseId
                  titleSnapshot
                  priceSnapshot
                  quantity
                }
              }
            }
          `,
          { studentId: studentId || me.id },
        )
        orders = asArray(ordersData?.myOrders).map((order) => ({
          orderId: order.id,
          createdAt: order.createdAt,
          total: order.total,
          currency: order.currency,
          status: order.status,
          items: asArray(order.items).map((item) => ({
            id: item.id,
            courseId: item.courseId,
            titleSnapshot: item.titleSnapshot,
            priceSnapshot: item.priceSnapshot,
            quantity: item.quantity,
            courseTitle: courseTitleMap.get(item.courseId) || null,
          })),
        }))
      } catch (err) {
        warn('orders fetch failed', err)
      }

      const studentMirror =
        orders.length || studentId
          ? {
              id: orders[0]?.studentId || studentId,
              userId: me.id,
              displayName:
                student?.displayName ||
                me.displayName ||
                [me.firstName, me.lastName].filter(Boolean).join(' ').trim() ||
                me.email,
              createdAt: student?.createdAt || null,
              updatedAt: student?.updatedAt || null,
            }
          : null

      return res.json({
        institution,
        authInstitution: institution
          ? {
              id: institution.id,
              name: institution.name,
              domain: institution.slug || null,
              createdAt: institution.createdAt,
              updatedAt: institution.updatedAt,
            }
          : null,
        user: me,
        student,
        member: membership,
        departments,
        classrooms: unifiedClassrooms,
        classroomEnrollments,
        courses,
        assignments,
        labs,
        orders,
        gradebookEntries,
        notes: [],
        studentMirror,
      })
    } catch (error) {
      warn('student-dashboard error', error)
      return res.status(502).json({ error: 'Failed to load student dashboard' })
    }
  })

  router.get('/teacher-dashboard', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    try {
      const meData = await gql('/api/authentication/graphql', `
        query Me { me { id email displayName roles firstName lastName } }
      `)
      const me = meData?.me
      if (!me?.id) return res.status(401).json({ error: 'Unable to resolve current user' })
      const allowedTeacher = await canUser('institution.teacher', { user: req.user, institutionId: institutionIdParam, req })
      if (!allowedTeacher) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const instData = await gql('/api/institutions/graphql', `
        query ($id:String!) { institution(id:$id) { id name slug type location email phone active createdAt updatedAt } }
      `, { id: institutionIdParam })
      const institution = instData?.institution || null
      if (!institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const membersData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!, $role:String) { members(institutionId:$institutionId, role:$role) { id institutionId userId role status createdAt updatedAt } }
      `, { institutionId: institution.id, role: 'teacher' })
      const teachers = asArray(membersData?.members)
      const classroomsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id institutionId departmentId teacherId title code capacity status startsAt endsAt enrollments { id studentId status } } }
      `, { institutionId: institution.id })
      const allRooms = asArray(classroomsData?.classrooms)
      const myRooms = allRooms.filter((r) => r.teacherId === me.id)
      const assignmentQuery = `
        query ($classroomId:String!) { assignmentsByClassroom(classroomId:$classroomId) { id classroomId title description dueDate createdAt updatedAt } }
      `
      const assignments = []
      await Promise.allSettled(myRooms.map(async (room) => {
        const data = await gql('/api/teach-internal/graphql', assignmentQuery, { classroomId: room.id })
        asArray(data?.assignmentsByClassroom).forEach((a) => assignments.push({ ...a, classroomName: room.title || room.code }))
      }))
      const overview = [
        { title: 'Your classrooms', meta: String(myRooms.length) },
        { title: 'Assignments to monitor', meta: String(assignments.length) },
      ]
      const stats = { departments: 0, classrooms: allRooms.length, members: teachers.length }
      return res.json({ institution, stats, classrooms: myRooms, assignments, overview })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load teacher dashboard' })
    }
  })

  router.get('/admin-dashboard', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    try {
      const instData = await gql('/api/institutions/graphql', `
        query ($id:String!) { institution(id:$id) { id name slug type location email phone active createdAt updatedAt } }
      `, { id: institutionIdParam })
      const institution = instData?.institution || null
      if (!institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const statsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { stats(institutionId:$institutionId) { classrooms activeClassrooms departments members students } }
      `, { institutionId: institution.id })
      const stats = statsData?.stats || { classrooms: 0, activeClassrooms: 0, departments: 0, members: 0, students: 0 }
      const membersData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { members(institutionId:$institutionId) { id institutionId userId role status createdAt updatedAt } }
      `, { institutionId: institution.id })
      const members = asArray(membersData?.members)
      const classroomsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id institutionId departmentId teacherId title code capacity status startsAt endsAt } }
      `, { institutionId: institution.id })
      const classrooms = asArray(classroomsData?.classrooms)
      const overview = [
        { title: 'Active classrooms', meta: String(stats.activeClassrooms || 0) },
        { title: 'Total students', meta: String(stats.students || 0) },
      ]
      return res.json({ institution, stats, members, classrooms, overview })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load admin dashboard' })
    }
  })

  router.get('/departments/:id/overview', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const id = String(req.params.id || '').trim()
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    try {
      const instData = await gql('/api/institutions/graphql', `
        query ($id:String!) { institution(id:$id) { id name slug type location email phone active createdAt updatedAt } }
      `, { id: institutionIdParam })
      const institution = instData?.institution || null
      if (!institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const departmentsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { departments(institutionId:$institutionId) { id institutionId name slug contact head active createdAt updatedAt } }
      `, { institutionId: institution.id })
      const department = asArray(departmentsData?.departments).find((d) => d.id === id) || null
      if (!department) return res.status(404).json({ error: 'Department not found' })
      const classroomsData = await gql('/api/institutions/graphql', `
        query ($departmentId:String) { classrooms(departmentId:$departmentId) { id institutionId departmentId teacherId title code capacity status startsAt endsAt } }
      `, { departmentId: id })
      const classrooms = asArray(classroomsData?.classrooms)
      const coursesResp = await fetchImpl(`${baseUrl}/api/teach-internal/courses`, { headers: { Authorization: authHeader } }).catch(() => null)
      const courseJson = coursesResp && (await coursesResp.json().catch(() => null))
      const rawCourses = asArray(courseJson?.data)
      const courses = rawCourses.filter((c) => classrooms.some((r) => String(c.title || '').toLowerCase().includes(String(r.code || r.title || '').toLowerCase()))).map((c) => ({ courseId: c.id, title: c.title, category: c.category || null, difficulty: c.difficulty || null }))
      return res.json({ institution, department, classrooms, courses })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load department overview' })
    }
  })

  router.get('/classrooms/:id/overview', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const id = String(req.params.id || '').trim()
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    try {
      const instData = await gql('/api/institutions/graphql', `
        query ($id:String!) { institution(id:$id) { id name slug type location email phone active createdAt updatedAt } }
      `, { id: institutionIdParam })
      const institution = instData?.institution || null
      if (!institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const roomData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id institutionId departmentId teacherId title code capacity status startsAt endsAt enrollments { id studentId status } } }
      `, { institutionId: institution.id })
      const room = asArray(roomData?.classrooms).find((r) => r.id === id) || null
      if (!room) return res.status(404).json({ error: 'Classroom not found' })
      const deptData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { departments(institutionId:$institutionId) { id institutionId name slug contact head active createdAt updatedAt } }
      `, { institutionId: institution.id })
      const department = asArray(deptData?.departments).find((d) => d.id === room.departmentId) || null
      const assignmentData = await gql('/api/teach-internal/graphql', `
        query ($classroomId:String!) { assignmentsByClassroom(classroomId:$classroomId) { id classroomId title description dueDate createdAt updatedAt } }
      `, { classroomId: room.id })
      const assignments = asArray(assignmentData?.assignmentsByClassroom)
      const coursesResp = await fetchImpl(`${baseUrl}/api/teach-internal/courses`, { headers: { Authorization: authHeader } }).catch(() => null)
      const courseJson = coursesResp && (await coursesResp.json().catch(() => null))
      const rawCourses = asArray(courseJson?.data)
      const matched = rawCourses.find((c) => String(c.title || '').toLowerCase().includes(String(room.code || room.title || '').toLowerCase()))
      const modulesResp = await fetchImpl(`${baseUrl}/api/teach-internal/modules`, { headers: { Authorization: authHeader } }).catch(() => null)
      const modulesJson = modulesResp && (await modulesResp.json().catch(() => null))
      const rawModules = asArray(modulesJson?.data)
      const lessonsResp = await fetchImpl(`${baseUrl}/api/teach-internal/lessons`, { headers: { Authorization: authHeader } }).catch(() => null)
      const lessonsJson = lessonsResp && (await lessonsResp.json().catch(() => null))
      const rawLessons = asArray(lessonsJson?.data)
      const modules = matched ? rawModules.filter((m) => m.courseId === matched.id) : []
      const lessons = modules.length ? rawLessons.filter((l) => modules.some((m) => m.id === l.moduleId)).map((l) => ({ id: l.id, title: l.title, type: l.type || null, moduleTitle: modules.find((m) => m.id === l.moduleId)?.title || '' })) : []
      const students = asArray(room.enrollments).map((e) => ({ studentId: e.studentId, displayName: e.studentId, status: e.status }))
      return res.json({ institution, department, classroom: room, assignments, lessons, students })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load classroom overview' })
    }
  })
  
  router.get('/classrooms/:id/classroom-course', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const classroomId = String(req.params.id || '').trim()
    try {
      const bindResp = await fetchImpl(`${baseUrl}/api/institutions/classrooms/${encodeURIComponent(classroomId)}/course-binding`, { headers: { Authorization: authHeader } }).catch(() => null)
      const bindJson = bindResp && (await bindResp.json().catch(() => null))
      const binding = bindJson?.binding || null
      const instId = bindJson?.institutionId || null
      const allowedView = await canUser('classroom.view', { user: req.user, institutionId: instId, req })
      if (!allowedView) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      if (!binding?.courseId) return res.json({ classroomId, bound: false })
      const courseResp = await fetchImpl(`${baseUrl}/api/teach-internal/courses/${encodeURIComponent(binding.courseId)}`, { headers: { Authorization: authHeader } }).catch(() => null)
      const courseJson = courseResp && (await courseResp.json().catch(() => null))
      const course = courseJson?.data || null
      const modulesResp = await fetchImpl(`${baseUrl}/api/teach-internal/modules`, { headers: { Authorization: authHeader } }).catch(() => null)
      const modulesJson = modulesResp && (await modulesResp.json().catch(() => null))
      const modules = Array.isArray(modulesJson?.data) ? modulesJson.data.filter((m) => m.courseId === binding.courseId) : []
      const lessonsResp = await fetchImpl(`${baseUrl}/api/teach-internal/lessons`, { headers: { Authorization: authHeader } }).catch(() => null)
      const lessonsJson = lessonsResp && (await lessonsResp.json().catch(() => null))
      const lessons = Array.isArray(lessonsJson?.data) ? lessonsJson.data.filter((l) => modules.some((m) => m.id === l.moduleId)) : []
      return res.json({ classroomId, bound: true, course: course ? { id: course.id, title: course.title, category: course.category || null, difficulty: course.difficulty || null } : null, moduleCount: modules.length, lessonCount: lessons.length })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load classroom course', details: err?.message || null })
    }
  })

  router.get('/catalog', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    try {
      const resp = await fetchImpl(`${baseUrl}/api/teach-internal/courses`, { headers: { Authorization: authHeader } })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const payload = await resp.json()
      const courses = asArray(payload?.data).map((c) => ({ courseId: c.id, title: c.title, teacherId: c.teacherId || null, category: c.category || null, difficulty: c.difficulty || null, availability: 'available' }))
      return res.json({ courses })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load catalog' })
    }
  })

  router.get('/people', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    const role = req.user?.id && institutionIdParam ? await (await import('./permissions.mjs')).resolveInstitutionRole(req.user.id, institutionIdParam, req) : null
    const allowed = await canUser('institution.admin', { user: req.user, role })
    if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    try {
      const membersData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { members(institutionId:$institutionId) { id institutionId userId role status createdAt updatedAt } }
      `, { institutionId: institutionIdParam })
      const members = asArray(membersData?.members)
      const classroomsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id institutionId departmentId teacherId title code capacity status startsAt endsAt } }
      `, { institutionId: institutionIdParam })
      const classrooms = asArray(classroomsData?.classrooms)
      const classroomCountByUser = {}
      classrooms.forEach((c) => {
        if (!c.teacherId) return
        classroomCountByUser[c.teacherId] = (classroomCountByUser[c.teacherId] || 0) + 1
      })
      const enriched = members.map((m) => ({ ...m, classroomCount: classroomCountByUser[m.userId] || 0 }))
      return res.json({ members: enriched })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load people' })
    }
  })

  router.get('/calendar', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    const role = req.user?.id && institutionIdParam ? await (await import('./permissions.mjs')).resolveInstitutionRole(req.user.id, institutionIdParam, req) : null
    const allowed = await canUser('institution.student', { user: req.user, role })
    if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    const from = req.query.from ? new Date(String(req.query.from)) : new Date()
    const to = req.query.to ? new Date(String(req.query.to)) : new Date(Date.now() + 30 * 86400e3)
    try {
      const instData = await gql('/api/institutions/graphql', `
        query ($id:String!) { institution(id:$id) { id name slug } }
      `, { id: institutionIdParam })
      const institution = instData?.institution || null
      if (!institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const roomsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id title code } }
      `, { institutionId: institution.id })
      const rooms = asArray(roomsData?.classrooms)
      const events = []
      const assignmentQuery = `
        query ($classroomId:String!) { assignmentsByClassroom(classroomId:$classroomId) { id title dueDate classroomId } }
      `
      await Promise.allSettled(rooms.map(async (room) => {
        const aData = await gql('/api/teach-internal/graphql', assignmentQuery, { classroomId: room.id })
        asArray(aData?.assignmentsByClassroom).forEach((a) => {
          const d = a.dueDate ? new Date(a.dueDate) : null
          if (!d) return
          if (d >= from && d <= to) {
            events.push({ id: a.id, assignmentId: a.id, institutionSlug: institution.slug, kind: 'assignment', title: a.title, date: a.dueDate, classroomName: room.title || room.code })
          }
        })
      }))
      const meData = await gql('/api/authentication/graphql', `
        query Me { me { id } }
      `)
      const userId = meData?.me?.id || null
      let labsData = null
      if (userId) {
        labsData = await gql('/api/teacher-course-lab/graphql', `
          query ($userId:String!) { tclab_sessionsByUser(userId:$userId) { id challengeId status lastHeartbeat } }
        `, { userId }).catch(() => null)
      }
      asArray(labsData?.tclab_sessionsByUser).forEach((s) => {
        const d = s.lastHeartbeat ? new Date(s.lastHeartbeat) : null
        if (!d) return
        if (d >= from && d <= to) events.push({ id: s.id, kind: 'lab', title: s.challengeId, date: s.lastHeartbeat, classroomName: null })
      })
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      return res.json({ events })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load calendar' })
    }
  })

  router.get('/classrooms/:id/attendance', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const id = String(req.params.id || '').trim()
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    try {
      const instData = await gql('/api/institutions/graphql', `
        query ($id:String!) { institution(id:$id) { id name } }
      `, { id: institutionIdParam })
      const institution = instData?.institution || null
      if (!institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const allowed = await canUser('attendance.edit', { user: req.user, institutionId: institution.id, req })
      if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
      const roomData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id title code enrollments { id studentId status } } }
      `, { institutionId: institution.id })
      const room = asArray(roomData?.classrooms).find((r) => r.id === id) || null
      if (!room) return res.status(404).json({ error: 'Classroom not found' })
      const assignmentData = await gql('/api/teach-internal/graphql', `
        query ($classroomId:String!) { assignmentsByClassroom(classroomId:$classroomId) { id title } }
      `, { classroomId: room.id })
      const assignmentIds = asArray(assignmentData?.assignmentsByClassroom).map((a) => a.id)
      const roster = []
      await Promise.allSettled(asArray(room.enrollments).map(async (enr) => {
        const subsData = await gql('/api/teach-internal/graphql', `
          query ($studentId:String!) { mySubmissions(studentId:$studentId) { assignmentId grade } }
        `, { studentId: enr.studentId }).catch(() => ({ mySubmissions: [] }))
        const mySubs = asArray(subsData?.mySubmissions).filter((s) => assignmentIds.includes(s.assignmentId))
        const avg = mySubs.length ? Math.round(mySubs.reduce((sum, s) => sum + Number(s.grade || 0), 0) / mySubs.length) : null
        roster.push({ studentId: enr.studentId, status: enr.status, submissions: mySubs.length, avgGrade: avg })
      }))
      return res.json({ classroom: room, roster })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load attendance' })
    }
  })

  router.post('/institutions/:id/join', express.json(), async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionId = String(req.params.id || '').trim()
    try {
      const meData = await gql('/api/authentication/graphql', `
        query Me { me { id email } }
      `)
      const me = meData?.me
      if (!me?.id) return res.status(401).json({ error: 'Unable to resolve current user' })
      const instCheck = await gql('/api/institutions/graphql', `
        query ($id:String!){ institution(id:$id){ id slug name } }
      `, { id: institutionId })
      if (!instCheck?.institution?.id) return res.status(404).json({ error: 'Institution not found' })
      const existing = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { members(institutionId:$institutionId) { id userId role status } }
      `, { institutionId })
      const found = asArray(existing?.members).find((m) => m.userId === me.id)
      if (found) return res.json({ ok: true, membership: found })
      const member = await gql('/api/institutions/graphql', `
        mutation ($institutionId:String!, $userId:String!, $role:String!, $status:String) {
          addMember(institutionId:$institutionId, userId:$userId, role:$role, status:$status) { id institutionId userId role status }
        }
      `, { institutionId, userId: me.id, role: 'student', status: 'ACTIVE' })
      return res.json({ ok: true, membership: member?.addMember || null })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to join institution', details: err?.message || null })
    }
  })

  router.post('/institutions/:id/leave', express.json(), async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionId = String(req.params.id || '').trim()
    try {
      const meData = await gql('/api/authentication/graphql', `
        query Me { me { id } }
      `)
      const me = meData?.me
      if (!me?.id) return res.status(401).json({ error: 'Unable to resolve current user' })
      const membersData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { members(institutionId:$institutionId) { id institutionId userId role status } }
      `, { institutionId })
      const membership = asArray(membersData?.members).find((m) => m.userId === me.id)
      if (!membership?.id) return res.status(404).json({ error: 'Membership not found' })
      await gql('/api/institutions/graphql', `
        mutation ($id:String!) { removeMember(id:$id) }
      `, { id: membership.id })
      return res.json({ ok: true })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to leave institution' })
    }
  })

  router.get('/teacher-assignments', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const institutionIdParam = String(req.query.institutionId || req.query.institution_id || '').trim()
    const role = req.user?.id && institutionIdParam ? await (await import('./permissions.mjs')).resolveInstitutionRole(req.user.id, institutionIdParam, req) : null
    const allowed = await canUser('institution.admin', { user: req.user, role })
    if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    try {
      const teachersData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!, $role:String) { members(institutionId:$institutionId, role:$role) { id institutionId userId role status createdAt updatedAt } }
      `, { institutionId: institutionIdParam, role: 'teacher' })
      const teachers = asArray(teachersData?.members).map((t) => ({ ...t, displayName: t.userId }))
      const classroomsData = await gql('/api/institutions/graphql', `
        query ($institutionId:String!) { classrooms(institutionId:$institutionId) { id institutionId departmentId teacherId title code capacity status startsAt endsAt } }
      `, { institutionId: institutionIdParam })
      const classrooms = asArray(classroomsData?.classrooms)
      const resp = await fetchImpl(`${baseUrl}/api/teach-internal/courses`, { headers: { Authorization: authHeader } })
      const payload = await resp.json().catch(() => ({}))
      const courses = asArray(payload?.data).map((c) => ({ courseId: c.id, title: c.title, teacherId: c.teacherId || null }))
      const assignments = []
      classrooms.forEach((c) => {
        if (c.teacherId) assignments.push({ id: `${c.id}`, type: 'classroom', teacher: c.teacherId, target: c.title })
      })
      courses.forEach((c) => {
        if (c.teacherId) assignments.push({ id: `${c.courseId}`, type: 'course', teacher: c.teacherId, target: c.title })
      })
      return res.json({ teachers, classrooms, courses, assignments })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load assignments' })
    }
  })

  router.post('/assignments/teacher', express.json(), async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const scope = String(req.body?.scope || '').trim()
    const teacherId = String(req.body?.teacherId || '').trim()
    const institutionIdParam = String(req.body?.institutionId || req.query?.institutionId || '').trim()
    const role = req.user?.id && institutionIdParam ? await (await import('./permissions.mjs')).resolveInstitutionRole(req.user.id, institutionIdParam, req) : null
    const allowed = await canUser('institution.admin', { user: req.user, role })
    if (!allowed) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    try {
      if (scope === 'classroom') {
        const classroomId = String(req.body?.classroomId || '').trim()
        const mutation = `mutation ($id:String!, $teacherId:String) { updateClassroom(id:$id, teacherId:$teacherId) { id teacherId } }`
        await callGraphQL(fetchImpl, `${baseUrl}/api/institutions/graphql`, mutation, { id: classroomId, teacherId }, authHeader)
        return res.json({ ok: true })
      }
      if (scope === 'course') {
        const courseId = String(req.body?.courseId || '').trim()
        const resp = await fetchImpl(`${baseUrl}/api/teach-internal/courses/${encodeURIComponent(courseId)}`, { method: 'PUT', headers: { 'content-type': 'application/json', Authorization: authHeader }, body: JSON.stringify({ teacherId }) })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        return res.json({ ok: true })
      }
      return res.status(400).json({ error: 'Invalid scope' })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to assign teacher' })
    }
  })

  router.get('/students/:id/record', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const baseUrl = normalizeBaseUrl(req)
    if (!baseUrl) return res.status(500).json({ error: 'Unable to resolve API base URL' })
    const fetchImpl = await ensureFetch()
    const gql = (path, query, variables = {}) => callGraphQL(fetchImpl, `${baseUrl}${path}`, query, variables, authHeader)
    const studentId = String(req.params.id || '').trim()
    const allowedBasic = await canUser('student-record.view', { user: req.user, role: null, studentId })
    if (!allowedBasic) return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Not allowed' } })
    try {
      const studentData = await gql('/api/students-internal/graphql', `
        query ($userId:String!) { studentByUserId(userId:$userId) { id userId displayName createdAt updatedAt } }
      `, { userId: studentId })
      const student = studentData?.studentByUserId || null
      const myCoursesData = await gql('/api/students-internal/graphql', `
        query ($studentId:String!) { myCourses(studentId:$studentId) { courseId progress completed course { id title category difficulty description } } }
      `, { studentId })
      const courses = asArray(myCoursesData?.myCourses).map((c) => ({ courseId: c.courseId, title: c.course?.title || 'Course', progressPct: Math.round(c.progress || 0), completed: !!c.completed }))
      const gradeData = await gql('/api/students-internal/graphql', `
        query ($courseId:ID!) { courseGradebook(courseId:$courseId) { id assignmentId studentId courseId grade feedback createdAt updatedAt } }
      `, { courseId: courses[0]?.courseId || '' }).catch(() => ({ courseGradebook: [] }))
      const gradebook = asArray(gradeData?.courseGradebook).filter((g) => g.studentId === student?.id)
      return res.json({ student, courses, gradebook })
    } catch (err) {
      return res.status(502).json({ error: 'Failed to load student record' })
    }
  })

  app.use('/api/institution-portal', router)
}

