const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, Module, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('PUT /api/modules/update-module/:moduleId', () => {
  let testUser
  let token
  let moduleInstance

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    testUser = await User.create({
      email: 'admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      prefix: 'Dr',
      job_title: 'Professor',
      role_id: 3,
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
      title: 'Old Title',
      code: 'OLD123',
      school_id: 1,
      year: '2023',
      CATs: 10
    })
  })

  it('successfully updates a module', async () => {
    const response = await supertest(app)
      .put(`/api/modules/update-module/${moduleInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Title',
        code: 'NEW123',
        year: '2024',
        CATs: 20
      })

    expect(response.status).toBe(200)
    expect(response.body.title).toBe('New Title')
    expect(response.body.code).toBe('NEW123')
    expect(response.body.year).toBe('2024')
    expect(response.body.CATs).toBe(20)
  })

  it('returns 400 if required fields are missing', async () => {
    const response = await supertest(app)
      .put(`/api/modules/update-module/${moduleInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Missing Fields'
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  it('returns 404 if module does not exist', async () => {
    const response = await supertest(app)
      .put('/api/modules/update-module/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Does Not Exist',
        code: 'DNE123',
        year: '2025',
        CATs: 30
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Module not found')
  })

  it('returns 401 if no token is provided', async () => {
    const response = await supertest(app)
      .put(`/api/modules/update-module/${moduleInstance.id}`)
      .send({
        title: 'No Auth',
        code: 'AUTH123',
        year: '2024',
        CATs: 20
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('returns 403 if user is unauthorized', async () => {
    const unauthorizedUser = await User.create({
      email: 'unauth@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Unauth',
      surname: 'User',
      prefix: 'Mr',
      job_title: 'Guest Lecturer',
      role_id: 1,
      active: 1
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const badToken = result.token

    const response = await supertest(app)
      .put(`/api/modules/update-module/${moduleInstance.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .send({
        title: 'Bad Auth',
        code: 'BAD123',
        year: '2024',
        CATs: 20
      })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
