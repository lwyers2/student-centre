const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust the path based on your structure
const { User, Role, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('User Creation API Endpoints', () => {
  let adminUser
  let token
  let authenticationUser
  let superUserRole

  beforeAll(async () => {
    // Ensure Super User role exists
    superUserRole = await Role.findOrCreate({
      where: { name: 'Super User' },
      defaults: { name: 'Super User' },
    }).then(([role]) => role)

    // Create an admin user with Super User role
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

    // Authenticate to get token
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

  // ✅ Test: Successfully create a new user
  it('should create a new user successfully', async () => {
    const newUser = {
      forename: 'John',
      surname: 'Doe',
      email: 'johndoe@qub.ac.uk',
      password: 'securepassword',
      active: true,
      roleName: 'Super User',
      jobTitle: 'Professor',
      prefix: 'Dr',
    }

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe(newUser.email)

    // Cleanup created user
    await User.destroy({ where: { email: newUser.email }, force: true })
  })

  // 🚫 Test: Missing required fields
  it('should return 400 if required fields are missing', async () => {
    const invalidUser = {
      surname: 'Doe',
      email: 'invalid@qub.ac.uk',
      password: 'password123',
      roleName: 'Super User',
    } // Missing 'forename'

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  // 🚫 Test: Role not found
  it('should return 400 if the specified role does not exist', async () => {
    const userWithInvalidRole = {
      forename: 'Jane',
      surname: 'Smith',
      email: 'jane@qub.ac.uk',
      password: 'password123',
      roleName: 'Nonexistent Role',
      jobTitle: 'Professor',
      prefix: 'Dr',
    }

    const response = await supertest(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userWithInvalidRole)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Role not found')
  })

  // 🚫 Test: Unauthorized user trying to create a user
  it('should return 403 if the user does not have the Super User role', async () => {
    // Create a non-admin user
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

    // Authenticate as normal user
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

    // Cleanup
    await AuthenticationUser.destroy({ where: { user_id: normalUser.id } })
    await User.destroy({ where: { id: normalUser.id }, force: true })
  })

  // 🚫 Test: Unauthorized request (No token)
  it('should return 401 if no token is provided', async () => {
    const newUser = {
      forename: 'Alex',
      surname: 'Brown',
      email: 'alex@qub.ac.uk',
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
