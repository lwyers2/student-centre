const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, Role, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('User Creation API Endpoints', () => {
  let adminUser
  let token
  let authenticationUser
  let superUserRole

  beforeAll(async () => {
    superUserRole = await Role.findOrCreate({
      where: { name: 'Super User' },
      defaults: { name: 'Super User' },
    }).then(([role]) => role)

    const hashedPassword = await bcrypt.hash('adminpassword', 10)
    adminUser = await User.create({
      email: 'admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      active: 1,
      role_id: superUserRole.id,
      job_title: 'admin',
      prefix: 'Mr'
    })

    const result = await authenticateUser(adminUser.email, 'adminpassword')
    token = result.token
    authenticationUser = await AuthenticationUser.findOne({ where: { token } })
  })

  afterAll(async () => {
    if (authenticationUser) await authenticationUser.destroy()
    if (adminUser) {
      await AuthenticationUser.destroy({ where: { user_id: adminUser.id } })
      await User.destroy({ where: { id: adminUser.id }, force: true })
    }
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should create a new user successfully', async () => {
    const newUser = {
      forename: 'Test',
      surname: 'User',
      email: 'testuser@qub.ac.uk',
      password: 'securepassword',
      active: true,
      role_id: superUserRole.id,
      job_title: 'Professor',
      prefix: 'Dr'
    }

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)

    console.log(response.body)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe(newUser.email)

    await User.destroy({ where: { email: newUser.email }, force: true })
  })

  it('should return 400 if required fields are missing', async () => {
    const invalidUser = {
      surname: 'Doe',
      email: 'invalid@qub.ac.uk',
      password: 'password123',
      roleName: 'Super User',
    }

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  it('should return 400 if the specified role does not exist', async () => {
    const userWithInvalidRole = {
      forename: 'Jane',
      surname: 'Smith',
      email: 'jane@qub.ac.uk',
      password: 'password123',
      roleName: 'Nonexistent Role',
      job_title: 'Professor',
      prefix: 'Dr',
    }

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userWithInvalidRole)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  it('should return 403 if the user does not have the Super User role', async () => {
    const normalUserRole = await Role.findOrCreate({
      where: { name: 'User' },
      defaults: { name: 'User' },
    }).then(([role]) => role)

    const hashedPassword = await bcrypt.hash('userpassword', 10)
    const normalUser = await User.create({
      email: 'user@qub.ac.uk',
      password: hashedPassword,
      forename: 'Normal',
      surname: 'User',
      active: 1,
      role_id: normalUserRole.id,
      job_title: 'Teacher',
      prefix: 'Mr',
    })

    const result = await authenticateUser(normalUser.email, 'userpassword')
    const normalUserToken = result.token

    const newUser = {
      forename: 'Sam',
      surname: 'Wilson',
      email: 'sam@qub.ac.uk',
      password: 'securepassword',
      roleName: 'Super User',
      jobTitle: 'Admin',
      prefix: 'Mr',
    }

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send(newUser)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')

    await AuthenticationUser.destroy({ where: { user_id: normalUser.id } })
    await User.destroy({ where: { id: normalUser.id }, force: true })
  })

  it('should return 401 if no token is provided', async () => {
    const newUser = {
      forename: 'John',
      surname: 'Smith',
      email: 'j.smith@qub.ac.uk',
      password: 'password123',
      roleName: 'Super User',
      jobTitle: 'Teacer',
      prefix: 'Mr',
    }

    const response = await supertest(app)
      .post('/api/users')
      .send(newUser)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })
})
