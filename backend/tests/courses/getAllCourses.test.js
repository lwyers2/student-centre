const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, AuthenticationUser, Course, QualificationLevel, School } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('Courses API Endpoints', () => {
  let testUser
  let token
  let authenticationUser

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)
    testUser = await User.create({
      email: 'test@qub.ac.uk',
      password: hashedPassword,
      forename: 'John',
      surname: 'Doe',
      active: 1,
      prefix: 'Prof',
      job_title: 'Professor',
      role_id: 3,
    })

    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    authenticationUser = await AuthenticationUser.findOne({ where: { token } })
  })

  afterAll(async () => {
    if (authenticationUser) await authenticationUser.destroy()
    if (testUser) {
      await AuthenticationUser.destroy({ where: { user_id: testUser.id } })
      await User.destroy({ where: { id: testUser.id }, force: true })
    }
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should get all courses if authorized', async () => {
    //set up for this test
    await QualificationLevel.create({ qualification: 'BSc', level_id: 1 })
    await School.create({ school_name: 'School of Computing' })

    const qualification = await QualificationLevel.findOne({ where: { qualification: 'BSc' } })
    const school = await School.findOne({ where: { school_name: 'School of Computing' } })

    await Course.create({
      title: 'Computer Science',
      code: 'CS101',
      years: 3,
      part_time: true,
      qualification_id: qualification.id,
      school_id: school.id,
    })
    await Course.create({
      title: 'Mathematics',
      code: 'MATH101',
      years: 2,
      part_time: false,
      qualification_id: qualification.id,
      school_id: school.id,
    })

    const response = await supertest(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('title')
    expect(response.body[0]).toHaveProperty('qualification')
    expect(response.body[0]).toHaveProperty('school')
  })

  it('should return 404 if no courses are found', async () => {
    await Course.destroy({ where: {} })

    const response = await supertest(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Courses not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app).get('/api/courses')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })

  it('should return 403 if user does not have required role', async () => {
    const unauthorizedUser = await User.create({
      email: 'unauthorized@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Tom',
      surname: 'Smith',
      active: 1,
      prefix: 'Mr',
      job_title: 'Visitor',
      role_id: 1,
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const unauthorizedToken = result.token

    const response = await supertest(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
