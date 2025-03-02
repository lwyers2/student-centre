//TODO make sure only active users can access things at all points
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust the path based on your structure
const { User, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('UserCourses API Endpoints', () => {
  let testUser
  let token
  let authenticationUser

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

  // Test GET /api/users/:user/courses
  it('should fetch user courses if authorized', async () => {
    const response = await supertest(app)
      .get(`/api/users/${testUser.id}/courses`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user).toHaveProperty('courses')
  })

  // User Not Found
  it('should return 404 if user does not exist', async () => {
    const response = await supertest(app)
      .get('/api/users/99999/courses') // Invalid user ID
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/users/${testUser.id}/courses`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get(`/api/users/${testUser.id}/courses`)
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })

  it('should return 400 if the user ID format is invalid', async () => {
    const response = await supertest(app)
      .get('/api/users/abc/courses') // Invalid user ID format
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
    expect(response.body.errors[0].msg).toBe('Invalid user ID format: ID must be an integer')
  })

  it('should return an empty array if the user has no courses', async () => {
    // Create a user with no courses
    const noCoursesUser = await User.create({
      email: 'no_courses@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Jane',
      surname: 'Doe',
      active: 1,
      prefix: 'Dr',
      job_title: 'Lecturer',
      role_id: 3,
    })

    const result = await authenticateUser(noCoursesUser.email, 'password123')
    const noCoursesToken = result.token

    const response = await supertest(app)
      .get(`/api/users/${noCoursesUser.id}/courses`)
      .set('Authorization', `Bearer ${noCoursesToken}`)

    expect(response.status).toBe(200)
    expect(response.body.user.courses).toEqual([]) // Empty array
  })


  // it('should return 403 if the user is inactive', async () => {
  //   // Update user to inactive
  //   await testUser.update({ active: 0 })

  //   const response = await supertest(app)
  //     .get(`/api/users/${testUser.id}/courses`)
  //     .set('Authorization', `Bearer ${token}`)

  //   expect(response.status).toBe(403)
  //   expect(response.body.error).toBe('User is inactive')
  // })

  it('should return 403 if the user does own the user and is not a super user', async () => {
    // Assuming roles 1, 2, 3 are valid, you can set up a user with a different role (e.g., 4)
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

      .get(`/api/users/${testUser.id}/courses`)
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })


})
