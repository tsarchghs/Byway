import express from 'express'
import cors from 'cors'

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

  app.use('/api/institution-portal', router)
}

