import express from 'express'
import cors from 'cors'

export async function register(app) {
  const router = express.Router()

  router.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
  }))

  //
  // GET /api/institution-portal/overview  (MOCKED)
  //
  router.get('/overview', async (req, res) => {
    const userId = 'user_1'

    const institutions = [
      {
        id: 'inst_1',
        name: 'Byway University',
        slug: 'byway-university',
        type: 'University',
        location: 'Berlin, Germany',
        email: 'info@bywayuni.eu',
        phone: '+49 30 1234567',
        active: true,
      },
      {
        id: 'inst_2',
        name: 'Tech Academy',
        slug: 'tech-academy',
        type: 'Academy',
        location: 'Munich, Germany',
        email: 'contact@techacademy.eu',
        phone: '+49 89 2345678',
        active: true,
      },
      {
        id: 'inst_3',
        name: 'Old Institute (Archived)',
        slug: 'old-institute',
        type: 'Institute',
        location: 'Hamburg, Germany',
        active: false,
      }
    ]

    const departments = [
      { id: 'dep_1', institutionId: 'inst_1', name: 'Computer Science', slug: 'cs', active: true },
      { id: 'dep_2', institutionId: 'inst_1', name: 'Mathematics', slug: 'math', active: true },
      { id: 'dep_3', institutionId: 'inst_2', name: 'Design', slug: 'design', active: true }
    ]

    const classrooms = [
      {
        id: 'class_1',
        institutionId: 'inst_1',
        departmentId: 'dep_1',
        title: 'Intro to Programming',
        code: 'CS101',
        capacity: 30,
        status: 'active',
        teacherId: userId,
        enrollments: [{}, {}, {}]
      },
      {
        id: 'class_2',
        institutionId: 'inst_1',
        departmentId: 'dep_2',
        title: 'Linear Algebra',
        code: 'MATH100',
        capacity: 25,
        status: 'active',
        teacherId: 'other_teacher',
        enrollments: [{}, {}]
      },
      {
        id: 'class_3',
        institutionId: 'inst_2',
        departmentId: 'dep_3',
        title: 'UX Design Basics',
        code: 'UX100',
        capacity: 20,
        status: 'pending',
        teacherId: userId,
        enrollments: []
      }
    ]

    const members = [
      { id: 'm1', institutionId: 'inst_1', userId, role: 'teacher', status: 'ACTIVE' },
      { id: 'm2', institutionId: 'inst_1', userId: 'std_1', role: 'student', status: 'ACTIVE' },

      { id: 'm3', institutionId: 'inst_2', userId, role: 'teacher', status: 'ACTIVE' },
      { id: 'm4', institutionId: 'inst_2', userId: 'std_2', role: 'student', status: 'ACTIVE' },

      { id: 'm5', institutionId: 'inst_3', userId, role: 'admin', status: 'ARCHIVED' }
    ]

    res.json({
      institutions,
      departments,
      classrooms,
      members
    })
  })

  //
  // OPTIONAL: Mock teach-internal GraphQL
  //
  router.post('/graphql-teach', async (req, res) => {
    res.json({
      data: {
        myCourses: [
          {
            id: 'course_1',
            title: 'Full Stack Web',
            difficulty: 'Intermediate',
            category: 'Web Dev',
            institutionId: 'inst_1'
          },
          {
            id: 'course_2',
            title: 'UI/UX Foundations',
            difficulty: 'Beginner',
            category: 'Design',
            institutionId: 'inst_2'
          }
        ]
      }
    })
  })

  //
  // Mount plugin at /api/institution-portal
  //
  app.use('/api/institution-portal', router)

  console.log('[institution-portal] Mock API ready at /api/institution-portal/overview')
}
