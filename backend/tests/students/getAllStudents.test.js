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

  it('should fetch all modules if authorized', async () => {
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
    await Module.destroy({ where: {} })

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
      .get('/api/modules')
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('Access denied: insufficient permissions {Role needed: 3 actual role id: 1}')
  })
})
