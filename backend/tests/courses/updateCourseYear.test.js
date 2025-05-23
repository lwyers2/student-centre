const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  Course,
  CourseYear,
  Role,
  AuthenticationUser,
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('PUT /api/courses/update-course-year/course/:courseId/course-year/:courseYearId', () => {
  let testUser
  let token
  let courseInstance
  let courseYearInstance
  let role
  let coordinator
  let newCoordinator

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    testUser = await User.create({
      email: 'test@qub.ac.uk',
      password: hashedPassword,
      forename: 'John',
      surname: 'Doe',
      prefix: 'Prof',
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

    courseInstance = await Course.create({
      title: 'Engineering Fundamentals',
      code: 'ENG101',
      years: 3,
      part_time: false,
      school_id: 1,
      qualification_id: 1,
    })

    role = await Role.create({ name: 'Lecturer' })
    coordinator = await User.create({
      email: 'coordinator@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Alice',
      surname: 'Smith',
      prefix: 'Dr',
      job_title: 'Course Coordinator',
      role_id: role.id,
      active: 1
    })

    courseYearInstance = await CourseYear.create({
      course_id: courseInstance.id,
      year_start: 2023,
      year_end: 2024,
      course_coordinator: coordinator.id
    })

    newCoordinator = await User.create({
      email: 'newcoordinator@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Bob',
      surname: 'Johnson',
      prefix: 'Dr',
      job_title: 'Senior Coordinator',
      role_id: role.id,
      active: 1
    })
  })

  it('should successfully update the course coordinator', async () => {
    const response = await supertest(app)
      .put(`/api/courses/update-course-year/course/${courseInstance.id}/course-year/${courseYearInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ course_coordinator: newCoordinator.id })

    expect(response.status).toBe(200)
    expect(response.body.course_coordinator).toBe(newCoordinator.id)
  })

  it('should return 404 if course year is not found', async () => {
    const nonExistentCourseYearId = 999999

    const response = await supertest(app)
      .put(`/api/courses/update-course-year/course/${courseInstance.id}/course-year/${nonExistentCourseYearId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ course_coordinator: newCoordinator.id })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course Year not found')
  })

  it('should return 404 if course is not found', async () => {
    const nonExistentCourseId = 999999

    const response = await supertest(app)
      .put(`/api/courses/update-course-year/course/${nonExistentCourseId}/course-year/${courseYearInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ course_coordinator: newCoordinator.id })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course not found')
  })

  it('should return 404 if course coordinator is not found', async () => {
    const nonExistentCoordinatorId = 999999

    const response = await supertest(app)
      .put(`/api/courses/update-course-year/course/${courseInstance.id}/course-year/${courseYearInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ course_coordinator: nonExistentCoordinatorId })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course Coordinator not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .put(`/api/courses/update-course-year/course/${courseInstance.id}/course-year/${courseYearInstance.id}`)
      .send({ course_coordinator: newCoordinator.id })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 403 if user does not have the required role', async () => {
    const badUser = await User.create({
      email: 'unauthorized@qub.ac.uk',
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
      .put(`/api/courses/update-course-year/course/${courseInstance.id}/course-year/${courseYearInstance.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .send({ course_coordinator: newCoordinator.id })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
