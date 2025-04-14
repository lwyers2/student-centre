const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust path as needed
const {
  User,
  AuthenticationUser,
  Course,
  QualificationLevel,
  School,
  CourseYear,
  UserCourse,
  Role
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/courses/:courseId', () => {
  let testUser
  let token
  let courseInstance
  let school
  let role
  let coordinator
  let testCourseYear

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

    const qualification = await QualificationLevel.create({ qualification: 'BSc' , level_id: 1 })
    school = await School.create({ school_name: 'Engineering School' })

    courseInstance = await Course.create({
      title: 'Engineering Fundamentals',
      code: 'ENG101',
      years: 3,
      part_time: false,
      qualification_id: qualification.id,
      school_id: school.id
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

    testCourseYear = await CourseYear.create({
      course_id: courseInstance.id,
      year_start: 2023,
      year_end: 2024,
      course_coordinator: coordinator.id
    })

    await UserCourse.create({
      course_id: courseInstance.id,
      user_id: coordinator.id,
      course_year_id: testCourseYear.id,
    })
  })


  it('should return full course details when valid ID and authorized', async () => {
    const response = await supertest(app)
      .get(`/api/courses/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('course')
    expect(response.body.course).toHaveProperty('title', 'Engineering Fundamentals')
    expect(response.body.course).toHaveProperty('code', 'ENG101')
    expect(response.body.course).toHaveProperty('school', 'Engineering School')
    expect(response.body.course_years).toBeInstanceOf(Array)
    expect(response.body.users).toBeInstanceOf(Array)
  })

  it('should return 404 if course not found', async () => {
    const nonExistentId = 999999

    const response = await supertest(app)
      .get(`/api/courses/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/courses/${courseInstance.id}`)

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
      .get(`/api/courses/${courseInstance.id}`)
      .set('Authorization', `Bearer ${badToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
