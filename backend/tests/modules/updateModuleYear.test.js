const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  Module,
  ModuleYear,
  AuthenticationUser
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('PUT /api/modules/update-module-year/module/:moduleId/module-year/:moduleYearId', () => {
  let testUser
  let token
  let moduleInstance
  let moduleYearInstance
  let secondUser

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    testUser = await User.create({
      email: 'admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      prefix: 'Dr',
      job_title: 'Professor',
      role_id: 3, // assuming role_id 3 is Super User
      active: 1
    })

    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )

    moduleInstance = await Module.create({
      title: 'Test Module',
      code: 'MOD123',
      school_id: 1,
      year: '2024',
      CATs: 20,
    })

    moduleYearInstance = await ModuleYear.create({
      module_id: moduleInstance.id,
      year_start: 2024,
      module_coordinator_id: testUser.id,
      semester_id: 1
    })

    secondUser = await User.create({
      email: 'coordinator@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Co',
      surname: 'Ordinator',
      prefix: 'Dr',
      job_title: 'Module Coordinator',
      role_id: 2, // assume 2 is Teacher
      active: 1
    })

  })

  it('successfully updates module year', async () => {
    const response = await supertest(app)
      .put(`/api/modules/update-module-year/module/${moduleInstance.id}/module-year/${moduleYearInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        coordinator: 2,
        semester: 2
      })

    expect(response.status).toBe(200)
    expect(response.body.module_id).toBe(moduleInstance.id)
    expect(response.body.id).toBe(moduleYearInstance.id)
    expect(response.body.module_coordinator_id).toBe(2)
    expect(response.body.semester_id).toBe(2)
  })

  it('returns 400 if missing fields', async () => {
    const response = await supertest(app)
      .put(`/api/modules/update-module-year/module/${moduleInstance.id}/module-year/${moduleYearInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        coordinator: 2
        // missing semester
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  it('returns 404 if module year does not exist', async () => {
    const nonExistentId = 999999

    const response = await supertest(app)
      .put(`/api/modules/update-module-year/module/${moduleInstance.id}/module-year/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        coordinator: secondUser.id,
        semester: 2
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Module year not found')
  })

  it('returns 401 if no token provided', async () => {
    const response = await supertest(app)
      .put(`/api/modules/update-module-year/module/${moduleInstance.id}/module-year/${moduleYearInstance.id}`)
      .send({
        coordinator: 2,
        semester: 2
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('returns 403 if user role is unauthorized', async () => {
    const unauthorizedUser = await User.create({
      email: 'unauthorized@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Unauthorized',
      surname: 'User',
      prefix: 'Mr',
      job_title: 'Guest Lecturer',
      role_id: 1,
      active: 1
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const badToken = result.token

    const response = await supertest(app)
      .put(`/api/modules/update-module-year/module/${moduleInstance.id}/module-year/${moduleYearInstance.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .send({
        coordinator: 2,
        semester: 2
      })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
