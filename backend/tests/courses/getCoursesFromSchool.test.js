const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  AuthenticationUser,
  Course,
  QualificationLevel,
  School,
  CourseYear,
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/courses/schools/:schoolId', () => {
  let testUser, token,  school, qualification, coordinator, course

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    testUser = await User.create({
      email: 'schooltest@qub.ac.uk',
      password: hashedPassword,
      forename: 'Jane',
      surname: 'Doe',
      prefix: 'Dr',
      job_title: 'Admin',
      role_id: 3,
      active: 1
    })

    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })

    qualification = await QualificationLevel.create({ qualification: 'BSc', level_id: 1 })
    school = await School.create({ school_name: 'School of Computing' })

    coordinator = await User.create({
      email: 'coordinator2@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Jake',
      surname: 'Lee',
      prefix: 'Prof',
      job_title: 'Coordinator',
      role_id: 3,
      active: 1
    })

    course = await Course.create({
      title: 'Computer Science',
      code: 'CSC101',
      years: 3,
      part_time: false,
      qualification_id: qualification.id,
      school_id: school.id
    })

    await CourseYear.create({
      course_id: course.id,
      year_start: 2023,
      year_end: 2024,
      course_coordinator: coordinator.id
    })
  })



  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return courses for a valid school ID', async () => {
    const response = await supertest(app)
      .get(`/api/courses/schools/${school.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('title', 'Computer Science')
    expect(response.body[0]).toHaveProperty('school', 'School of Computing')
    expect(response.body[0].course_years[0]).toHaveProperty('course_coordinator')
  })

  it('should return 404 if no courses exist for the school', async () => {
    const newSchool = await School.create({ school_name: 'Empty School' })

    const response = await supertest(app)
      .get(`/api/courses/schools/${newSchool.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Courses not found')

    await newSchool.destroy()
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/courses/schools/${school.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 403 if user does not have the required role', async () => {
    const unauthorizedUser = await User.create({
      email: 'noaccess@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Sam',
      surname: 'NoAccess',
      prefix: 'Mr',
      job_title: 'Guest',
      role_id: 1,
      active: 1
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const unauthorizedToken = result.token

    const response = await supertest(app)
      .get(`/api/courses/schools/${school.id}`)
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
