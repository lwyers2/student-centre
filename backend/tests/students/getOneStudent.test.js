const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, AuthenticationUser, Student } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('Student API Endpoints', () => {
  let testUser
  let token
  let authenticationUser
  let testStudent

  beforeAll(async () => {
    // Hash password and create test user
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

    // Create a test student
    testStudent = await Student.create({
      email: 'student@qub.ac.uk',
      student_code: 'S12345',
      forename: 'Jane',
      surname: 'Smith',
    })

    // Authenticate user and get token
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
    if (testStudent) {
      await Student.destroy({ where: { id: testStudent.id }, force: true })
    }
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should fetch student details if authorized', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.student).toHaveProperty('id', testStudent.id)
    expect(response.body.student).toHaveProperty('forename', 'Jane')
    expect(response.body.student).toHaveProperty('surname', 'Smith')
  })

  it('should return 404 if student not found', async () => {
    const response = await supertest(app)
      .get('/api/students/9999')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Student not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app).get(`/api/students/${testStudent.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}`)
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })

})
