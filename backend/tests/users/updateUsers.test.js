const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, School, UserSchool, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('PUT /api/users/:user', () => {
  let superUser
  let token
  let targetUser
  let school1, school2

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    superUser = await User.create({
      email: 'admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      prefix: 'Dr',
      job_title: 'Super Admin',
      role_id: 3,
      active: 1
    })

    const result = await authenticateUser(superUser.email, 'password123')
    token = result.token
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )

    targetUser = await User.create({
      email: 'target@qub.ac.uk',
      password: await bcrypt.hash('originalPass123', 10),
      forename: 'Target',
      surname: 'User',
      prefix: 'Ms',
      job_title: 'Lecturer',
      role_id: 2,
      active: 1
    })

    school1 = await School.create({ school_name: 'School of Testing' })
    school2 = await School.create({ school_name: 'School of DevOps' })

    await UserSchool.create({ user_id: targetUser.id, school_id: school1.id })
  })

  it('successfully updates a user including schools and password', async () => {
    const response = await supertest(app)
      .put(`/api/users/${targetUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        forename: 'Updated',
        surname: 'User',
        email: 'updated@qub.ac.uk',
        password: 'newPassword123',
        active: 1,
        roleId: 2,
        jobTitle: 'Updated Lecturer',
        prefix: 'Dr',
        schools: [school2.id]
      })

    expect(response.status).toBe(200)
    expect(response.body.forename).toBe('Updated')
    expect(response.body.email).toBe('updated@qub.ac.uk')

    const updatedUserSchools = await UserSchool.findAll({ where: { user_id: targetUser.id } })
    expect(updatedUserSchools.length).toBe(1)
    expect(updatedUserSchools[0].school_id).toBe(school2.id)
  })

  it('returns 404 if user not found', async () => {
    const response = await supertest(app)
      .put('/api/users/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        forename: 'Ghost',
        email: 'ghost@qub.ac.uk',
        roleId: 2
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('User not found')
  })

  it('returns 401 if no token is provided', async () => {
    const response = await supertest(app)
      .put(`/api/users/${targetUser.id}`)
      .send({
        forename: 'No Auth',
        email: 'noauth@qub.ac.uk',
        roleId: 2
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('returns 403 if user role is unauthorized', async () => {
    const basicUser = await User.create({
      email: 'basic@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Basic',
      surname: 'User',
      prefix: 'Mr.',
      role_id: 1,
      active: 1,
      job_title: 'Basic User'
    })

    const result = await authenticateUser(basicUser.email, 'password123')
    const basicToken = result.token

    const response = await supertest(app)
      .put(`/api/users/${targetUser.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .send({
        forename: 'Hacker',
        email: 'hacker@qub.ac.uk',
        roleId: 2
      })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
