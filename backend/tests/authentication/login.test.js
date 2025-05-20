const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, AuthenticationUser } = require('../../models')


describe('POST /login', () => {
  let testUser

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

  it('should return 400 when password is missing', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'test@qub.ac.uk',
        password: '',
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Password is required')
  })

  it('should return 400 when email is missing', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: '',
        password: 'password123',
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Email is required')
  })

  it('should return 400 when email and password are missing', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: '',
        password: '',
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Email and password are required')
  })

  it('should return 400 when email is invalid', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'invalid-email',
        password: 'password123',
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid email format')
  })

  it('should return 401 if the account is inactive', async () => {
    // update the test user to be inactive
    await User.update({ active: 0 }, { where: { id: testUser.id } })

    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'test@qub.ac.uk',
        password: 'password123',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Account is inactive')
    await User.update({ active: 1 }, { where: { id: testUser.id } })
  })

  it('should block login attempt after 5 tries', async () => {
    for (let i = 0; i < 5; i++) {
      await supertest(app).post('/api/login').send({
        email: 'test@qub.ac.uk',
        password: 'wrongpassword',
      })
    }

    const response = await supertest(app).post('/api/login').send({
      email: 'test@qub.ac.uk',
      password: 'wrongpassword',
    })

    expect(response.status).toBe(429)
    expect(response.body.error).toBe('Too many failed login attempts. Please try again later.')

    //reset uesr
    await User.update({ failed_attempts: 0 }, { where: { id: testUser.id } })
  })

  it('should not log the password in the console', async () => {
    // Mock console.log to spy on calls to it
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const appWithLoggingBug = require('../../app')

    // simulate a login request
    await supertest(appWithLoggingBug)
      .post('/api/login')
      .send({ email: 'test@qub.ac.uk', password: 'password123' })

    // force the test to faile by expecting console.log to have been called with the password
    expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('password123'))

    logSpy.mockRestore() // Restore the original console.log
  })

  it('should allow login with new password after the password is reset', async () => {
    const newPassword = 'newPassword123'

    // reset password in db
    await User.update({ password: await bcrypt.hash(newPassword, 10) }, { where: { id: testUser.id } })

    const response = await supertest(app)
      .post('/api/login')
      .send({
        email: 'test@qub.ac.uk',
        password: newPassword,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')

    //reset user
    await User.update({ password: await bcrypt.hash('password123', 10) }, { where: { id: testUser.id } })
  })

  it('should return a token with the correct structure', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({ email: 'test@qub.ac.uk', password: 'password123' })

    expect(response.status).toBe(200)
    const token = response.body.token
    const tokenParts = token.split('.')
    expect(tokenParts.length).toBe(3)
  })

  // This was a test for rate limiting, I didn't keep this up for other tests, but should have
  it('should respond within acceptable time limit', async () => {
    const start = Date.now()
    await supertest(app)
      .post('/api/login')
      .send({ email: 'test@qub.ac.uk', password: 'password123' })
    const duration = Date.now() - start
    expect(duration).toBeLessThan(500)
  })

  it('should not store the password in plain text', async () => {
    await supertest(app)
      .post('/api/login')
      .send({ email: 'test@qub.ac.uk', password: 'password123' })

    const storedUser = await User.findOne({ where: { email: 'test@qub.ac.uk' } })
    const isPasswordCorrect = await bcrypt.compare('password123', storedUser.password)
    expect(isPasswordCorrect).toBe(true)
  })

})
