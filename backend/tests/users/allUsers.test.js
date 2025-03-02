const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust the path based on your structure
const { User, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('All Users', () => {
  let testUser
  let token
  let authenticationUser

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

  //Test GET /api/users (Super User role required)
  it('should fetch all users if authorized', async () => {
    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true) // Check if response is an array
  })

  it('should return 403 if user is not a Super User', async () => {
    // Create a new user with a lower role (not 'Super User')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const normalUser = await User.create({
      email: 'normaluser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Sarah',
      surname: 'Hall',
      active: 1,
      prefix: 'Dr',
      job_title: 'Lecturer',
      role_id: 1,
    })

    const normalUserAuth = await authenticateUser(normalUser.email, 'password123')
    const normalUserToken = normalUserAuth.token

    // Attempt to fetch all users (Super User-only route)
    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${normalUserToken}`)

    // Cleanup test user
    await AuthenticationUser.destroy({ where: { user_id: normalUser.id } })
    await User.destroy({ where: { id: normalUser.id }, force: true })

    // Expect 403 since normal user doesn't have permission
    expect(response.status).toBe(403)
    expect(response.body.error).toBe('Access denied: insufficient permissions {Role needed: 3 actual role id: 1}')
  })

  it('should return 401 if token is expired', async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() - 3600 * 1000) }, // Expired 1 hour ago
      { where: { token } }
    )

    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token expired')
  })

  it('should return 401 if token is deactivated', async () => {
    await AuthenticationUser.update(
      { is_active: false },
      { where: { token } }
    )

    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token invalid')
  })

  it('should return 401 if token format is incorrect', async () => {
    const response = await supertest(app)
      .get('/api/users')
      .set('Authorization', 'InvalidTokenFormat')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get('/api/users')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })
})
