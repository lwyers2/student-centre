const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, AuthenticationUser } = require('../../models')

describe('POST /login', () => {
  let testUser

  beforeAll(async () => {
    // Create the user once before all tests run
    const hashedPassword = await bcrypt.hash('password123', 10)
    testUser = await User.create({
      email: 'test@qub.ac.uk',
      password: hashedPassword,
      forename: 'John',
      surname: 'Doe',
      active: 1,
      prefix: 'Prof',
      job_title: 'Professor',
      role_id: 1
    })
  })

  afterAll(async () => {
    if (testUser) {
      await AuthenticationUser.destroy({ where: { user_id: testUser.id }, force: true })
      await User.destroy({ where: { id: testUser.id }, force: true })
    }
  })

  it('should return a token when valid credentials are provided', async () => {
    const response = await supertest(app)
      .post('/api/login')
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
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'wrong@example.com',
        password: 'password123',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Email not found')
  })

  it('should return 401 when password is incorrect', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'test@qub.ac.uk',
        password: 'wrongpassword',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Incorrect password')
  })

  
})
