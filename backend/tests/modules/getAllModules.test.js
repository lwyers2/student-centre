const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust based on project structure
const { User, AuthenticationUser, Module } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('Modules API Endpoints', () => {
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
      role_id: 3, // Assuming this is a role with access to modules
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
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  // Test GET /api/modules
  it('should fetch all modules if authorized', async () => {
    // Mock database response
    await Module.create({
      title: 'Mathematics',
      code: 'MATH101',
      year: 2024,
      CATs: 15,
    })

    const response = await supertest(app)
      .get('/api/modules')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should return 404 if no modules are found', async () => {
    await Module.destroy({ where: {} }) // Clear modules

    const response = await supertest(app)
      .get('/api/modules')
      .set('Authorization', `Bearer ${token}`)


    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Modules not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app).get('/api/modules')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get('/api/modules')
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })

  // it('should return 403 if the user is inactive', async () => {
  //   await testUser.update({ active: 0 }) // Set user to inactive

  //   const response = await supertest(app)
  //     .get('/api/modules')
  //     .set('Authorization', `Bearer ${token}`)

  //   expect(response.status).toBe(403)
  //   expect(response.body.error).toBe('User is inactive')
  // })

  it('should return 403 if user does not have required role', async () => {
    // Create a user without permission
    const unauthorizedUser = await User.create({
      email: 'unauthorized@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Tom',
      surname: 'Smith',
      active: 1,
      prefix: 'Mr',
      job_title: 'Visitor',
      role_id: 1, // Unauthorized role
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const unauthorizedToken = result.token

    const response = await supertest(app)
      .get('/api/modules')
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('Access denied: insufficient permissions {Role needed: 3 actual role id: 1}')
  })
})
