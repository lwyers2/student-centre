// tests/authentication/login.test.js
const request = require('supertest')
const app = require('../../app') // Adjust the path as needed
const { User } = require('../../models')
const bcrypt = require('bcrypt')

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

describe('POST /login', () => {
  let testUser // Declare testUser to be used in beforeAll and afterAll

  beforeAll(async () => {
    // Seed a test user into the database
    const hashedPassword = await bcrypt.hash('password123', 10) // Hash the password
    testUser = await User.create({ // Save the user to the database
      email: 'test@qub.ac.uk',
      password: hashedPassword,
      forename: 'John',
      surname: 'Doe',
      active: 0,
      prefix: 'Prof',
      job_title: 'Professor',
      role_id: 1
    })
  })

  afterAll(async () => {
    // Clean up by deleting the test user
    await User.destroy({ where: { id: testUser.id } })
  })

  it('should return a token when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@qub.ac.uk',
        password: 'password123',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.email).toBe('test@qub.ac.uk')
    expect(response.body.forename).toBe('John')
    expect(response.body.surname).toBe('Doe')
    expect(response.body.id).toBeDefined()
  })

  it('should return 401 when email is incorrect', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'wrong@example.com',
        password: 'password123',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Email not found')
  })

  it('should return 401 when password is incorrect', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@qub.ac.uk',
        password: 'wrongpassword',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Incorrect password')
  })
})
