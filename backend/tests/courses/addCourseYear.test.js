const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  Course,
  Role,
  AuthenticationUser,
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('POST /api/courses/add-course-year/course/:courseId', () => {
  let token
  let courseInstance
  let role
  let coordinator

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    const testUser = await User.create({
      email: 'testsuperuser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Jane',
      surname: 'Doe',
      prefix: 'Dr',
      job_title: 'Professor',
      role_id: 3,
      active: 1
    })

    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )

    role = await Role.create({ name: 'Lecturer' })

    coordinator = await User.create({
      email: 'coordinator@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Course',
      surname: 'Coordinator',
      prefix: 'Dr',
      job_title: 'Coordinator',
      role_id: role.id,
      active: 1
    })

    courseInstance = await Course.create({
      title: 'Mathematics Fundamentals',
      code: 'MATH101',
      years: 3,
      part_time: false,
      school_id: 1,
      qualification_id: 1
    })
  })

  it('should successfully add a new course year', async () => {
    const response = await supertest(app)
      .post(`/api/courses/add-course-year/course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        yearStart: 2025,
        courseYears: 1,
        courseCoordinatorId: coordinator.id
      })

    expect(response.status).toBe(201)
    expect(response.body.course_id).toBe(courseInstance.id)
    expect(response.body.year_start).toBe(2025)
    expect(response.body.year_end).toBe(2026)
    expect(response.body.course_coordinator).toBe(coordinator.id)
  })

  it('should return 400 if required fields are missing', async () => {
    const response = await supertest(app)
      .post(`/api/courses/add-course-year/course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields: yearStart or courseYears')
  })

  it('should return 404 if course does not exist', async () => {
    const invalidCourseId = 999999

    const response = await supertest(app)
      .post(`/api/courses/add-course-year/course/${invalidCourseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        yearStart: 2025,
        courseYears: 1,
        courseCoordinatorId: coordinator.id
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course not found')
  })

  it('should return 404 if course coordinator is not found', async () => {
    const invalidCoordinatorId = 999999

    const response = await supertest(app)
      .post(`/api/courses/add-course-year/course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        yearStart: 2025,
        courseYears: 1,
        courseCoordinatorId: invalidCoordinatorId
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course Coordinator not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .post(`/api/courses/add-course-year/course/${courseInstance.id}`)
      .send({
        yearStart: 2025,
        courseYears: 1,
        courseCoordinatorId: coordinator.id
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 403 if user does not have Super User role', async () => {
    const badUser = await User.create({
      email: 'unauthorizeduser@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Unauthorized',
      surname: 'User',
      prefix: 'Mr',
      job_title: 'Visitor',
      role_id: 1,
      active: 1
    })

    const result = await authenticateUser(badUser.email, 'password123')
    const badToken = result.token

    const response = await supertest(app)
      .post(`/api/courses/add-course-year/course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .send({
        yearStart: 2025,
        courseYears: 1,
        courseCoordinatorId: coordinator.id
      })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
