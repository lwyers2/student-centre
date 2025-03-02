const supertest = require('supertest')
const app = require('../../app')
const bcrypt = require('bcrypt')
const { User, AuthenticationUser, UserModule, ModuleYear, Module, ModuleCourse } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('User Modules API Endpoints', () => {
  let testUser
  let token
  let authenticationUser
  let courseYearId = 1 // Example course year ID

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    testUser = await User.create({
      email: 'testuser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Test',
      surname: 'User',
      active: 1,
      prefix: 'Dr',
      job_title: 'Lecturer',
      role_id: 3,
    })

    // Authenticate user
    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    authenticationUser = await AuthenticationUser.findOne({ where: { token } })


    const module = await Module.create({
      id: 101,
      title: 'Software Engineering',
      code: 'CS3010',
      CATs: 20,
      year: 3,
    })

    // Create associated module data
    const moduleYear = await ModuleYear.create({
      year_start: 2023,
      semester_id: 1,
      module_coordinator_id: 1,
      module_id: module.id,
    })



    await ModuleCourse.create({
      course_year_id: courseYearId,
      module_year_id: moduleYear.id,
      course_id: 1,
      module_id: module.id
    })

    await UserModule.create({
      module_id: module.id,
      module_year_id: moduleYear.id,
      user_id: testUser.id,
    })

  })

  afterAll(async () => {
    if (authenticationUser) await authenticationUser.destroy()
    if (testUser) {
      await AuthenticationUser.destroy({ where: { user_id: testUser.id } })
      await UserModule.destroy({ where: { user_id: testUser.id } })
      await User.destroy({ where: { id: testUser.id }, force: true })
    }
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  // ✅ Test successful retrieval of user modules
  it('should fetch user modules for a valid user and course year', async () => {
    const response = await supertest(app)
      .get(`/api/users/${testUser.id}/modules/${courseYearId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user).toHaveProperty('forename', 'Test')
    expect(response.body.modules.length).toBeGreaterThan(0)
    expect(response.body.modules[0]).toHaveProperty('title', 'Software Engineering')
  })

  // 🚫 User Not Found (404)
  it('should return 404 if user does not exist', async () => {
    const response = await supertest(app)
      .get('/api/users/99999/modules/1') // Non-existent user ID
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('User not found')
  })

  // 🚫 Missing Authorization Token (401)
  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/users/${testUser.id}/modules/${courseYearId}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  // 🚫 Invalid Parameters (400)
  it('should return 400 for invalid user ID or course year format', async () => {
    const response = await supertest(app)
      .get('/api/users/invalidUser/modules/invalidYear') // Non-numeric IDs
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
  })
})
