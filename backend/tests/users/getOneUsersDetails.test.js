const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  Role,
  School,
  UserSchool,
  AuthenticationUser,
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/users/user-details/:userId', () => {
  let superUser
  let token
  let school

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    school = await School.create({ school_name: 'Engineering' })

    superUser = await User.create({
      email: 'superuser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      active: 1,
      prefix: 'Dr',
      job_title: 'Lecturer',
      role_id: 3,
    })

    await UserSchool.create({
      user_id: superUser.id,
      school_id: school.id,
    })

    const result = await authenticateUser(superUser.email, 'password123')
    token = result.token
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: { user_id: superUser.id } })
    await UserSchool.destroy({ where: { user_id: superUser.id } })
    await User.destroy({ where: { id: superUser.id }, force: true })
    await School.destroy({ where: { id: school.id } })
    await Role.destroy({ where: { id: 3 } })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return user details if authorized', async () => {
    const res = await supertest(app)
      .get(`/api/users/user-details/${superUser.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', superUser.id)
    expect(res.body).toHaveProperty('email', 'superuser@qub.ac.uk')
    expect(res.body).toHaveProperty('role')
    expect(res.body.role).toHaveProperty('name', 'Super User')
    expect(res.body.schools[0]).toHaveProperty('school', 'Engineering')
  })

  it('should return 404 if user does not exist', async () => {
    const res = await supertest(app)
      .get('/api/users/user-details/999999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message || res.text).toMatch(/User not found/i)
  })

  it('should return 401 if no token is provided', async () => {
    const res = await supertest(app).get(`/api/users/user-details/${superUser.id}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 if token is expired', async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() - 3600 * 1000) },
      { where: { token } }
    )

    const res = await supertest(app)
      .get(`/api/users/user-details/${superUser.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token expired')
  })

  it('should return 401 if token is deactivated', async () => {
    await AuthenticationUser.update(
      { is_active: false },
      { where: { token } }
    )

    const res = await supertest(app)
      .get(`/api/users/user-details/${superUser.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token invalid')
  })

  it('should return 401 if token format is incorrect', async () => {
    const res = await supertest(app)
      .get(`/api/users/user-details/${superUser.id}`)
      .set('Authorization', 'WrongFormatToken')

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })
})
