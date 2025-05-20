const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { authenticateUser } = require('../../services/authenticateUser')
const { User, AuthenticationUser } = require('../../models')

//TODO:
// Set up a way that only a user who is logged in can signout.

describe('POST /logout', () => {
  let testUser
  let token
  let authenticationUser

  // set up a user and authenticate them
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
      role_id: 1,
    })

    const result = await authenticateUser(testUser.email, 'password123')

    token = result.token
    authenticationUser = await AuthenticationUser.findOne({ where : { token: token } })
  })

  afterAll(async () => {
    // Clean up any database records
    if (authenticationUser) {
      await authenticationUser.destroy()
    }
    if (testUser) {
      await AuthenticationUser.destroy({ where: { user_id: testUser.id } })
      await User.destroy({ where: { id: testUser.id }, force: true })
    }
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token:token } }
    )
  })

  it('should successfully log out when a valid token is provided', async () => {
    const response = await supertest(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`)


    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Logged out successfully')

    // make sure token is deactivated
    const deactivatedUser = await AuthenticationUser.findOne({
      where: { token },
    })

    expect(deactivatedUser.is_active).toBe(false)
  })

  it('should return 401 when no token is provided', async () => {
    const response = await supertest(app).post('/api/logout')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 if the token is expired', async () => {
    // manually expire the token
    authenticationUser.expires_at = new Date(Date.now() - 3600 * 1000)
    await authenticationUser.save()

    const response = await supertest(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token expired')
  })

  // it('should return 404 if the token does not belong to the user', async () => {
  //   // Create Jane Doe and authenticate her
  //   const jane = await User.create({
  //     email: 'jane.doe@qub.ac.uk',
  //     password: await bcrypt.hash('password456', 10),
  //     forename: 'Jane',
  //     surname: 'Doe',
  //     active: 1,
  //     prefix: 'Dr',
  //     job_title: 'Lecturer',
  //     role_id: 1,
  //   })

  //   const janeResult = await authenticateUser(jane.email, 'password456')
  //   const janeToken = janeResult.token

  //   // Create another user and authenticate them
  //   const anotherUser = await User.create({
  //     email: 'anotheruser@qub.ac.uk',
  //     password: await bcrypt.hash('password789', 10),
  //     forename: 'John',
  //     surname: 'Smith',
  //     active: 1,
  //     prefix: 'Mr',
  //     job_title: 'Assistant',
  //     role_id: 1,
  //   })

  //   const anotherUserResult = await authenticateUser(anotherUser.email, 'password789')
  //   const anotherUserToken = anotherUserResult.token

  //   const validResponse = await supertest(app)
  //     .post('/api/logout')
  //     .set('Authorization', `Bearer ${janeToken}`)

  //   expect(validResponse.status).toBe(200)
  //   expect(validResponse.body.message).toBe('Logged out successfully')

  //   const response = await supertest(app)
  //     .post('/api/logout')
  //     .set('Authorization', `Bearer ${anotherUserToken}`)

  //   expect(response.status).toBe(404)
  //   expect(response.body.error).toBe('Token not found or does not belong to the user')
  // })


  it('should not allow a second logout with the same token', async () => {

    const response1 = await supertest(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`)

    expect(response1.status).toBe(200)
    expect(response1.body.message).toBe('Logged out successfully')

    const response2 = await supertest(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`)

    //token will be inactive after logging out
    expect(response2.status).toBe(401)
    expect(response2.body.error).toBe('Token invalid')
  })

  it('should return 401 for malformed token', async () => {
    const malformedToken = 'Bearer ' + 'invalidtokenstring'

    const response = await supertest(app)
      .post('/api/logout')
      .set('Authorization', malformedToken)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })

})
