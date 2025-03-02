//TODO: Module not found

const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust based on your project structure
const { User, AuthenticationUser,  ModuleYear, UserModule, Module } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('Module Year API Endpoints', () => {
  let testUser
  let token
  let authenticationUser
  let testModuleYear
  let testModule

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
      role_id: 1,
    })

    testModule = await Module.create({
      title: 'Introduction to Performing',
      year: 1,
      code: 'DRA0001',
      CATs: 20,
    })

    // Create a test module year to associate with the user later
    testModuleYear = await ModuleYear.create({
      year_start: 2024,
      semester_id: 1,
      module_coordinator_id: testUser.id,
      module_id: testModule.id
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

  // Test GET /api/modules/module-year/:moduleYear
  it('should fetch module year details if authorized', async () => {
    // Assign the module year to the user
    await UserModule.create({
      user_id: testUser.id,
      module_year_id: testModuleYear.id,
      module_id: testModule.id
    })

    const response = await supertest(app)
      .get(`/api/modules/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.module[0]).toHaveProperty('module_year_id', testModuleYear.id)
    expect(response.body.module[0]).toHaveProperty('year_start', 2024)
  })

  it('should return 403 if user is not assigned to module year', async () => {
    // Create another module year without assigning it to the test user
    const anotherModuleYear = await ModuleYear.create({
      year_start: 2024,
      semester_id: 1,
      module_id: testModule.id,
      module_coordinator_id: testUser.id,
    })

    const response = await supertest(app)
      .get(`/api/modules/module-year/${anotherModuleYear.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Access denied: You are not assigned to this module.')
  })

  // it('should return 404 if module year not found', async () => {
  //   const invalidModuleYearId = 9999 // Assume this module year doesn't exist
  //   const response = await supertest(app)
  //     .get(`/api/modules/module-year/${invalidModuleYearId}`)
  //     .set('Authorization', `Bearer ${token}`)

  //     console.log(response)
  //   expect(response.status).toBe(404)
  //   expect(response.body.error).toBe('Module not found')
  // })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app).get(`/api/modules/module-year/${testModuleYear.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get(`/api/modules/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })

  it('should return 403 if the user does not have required role', async () => {
    // Create a user without the required permissions
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
      .get(`/api/modules/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Access denied: You are not assigned to this module.')
  })
})
