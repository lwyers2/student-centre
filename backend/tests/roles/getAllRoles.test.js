const supertest = require('supertest')
const app = require('../../app')  // Make sure the path is correct to your app
const { Role } = require('../../models')
const request = supertest(app)

describe('GET /api/roles', () => {
  beforeAll(async () => {
    // You can add roles to the database if needed for the test
    await Role.create({ name: 'Admin' })
    await Role.create({ name: 'User' })
  })

  afterAll(async () => {
    // Clean up after tests (remove roles from DB)
    await Role.destroy({ where: {}, force: true })
  })

  it('should return all roles', async () => {
    const res = await request.get('/api/roles')

    // Check if the response status is 200 OK
    expect(res.status).toBe(200)

    // Check if the response contains an array of roles
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBeGreaterThan(0) // Expect at least one role

    // Check if the roles have 'id' and 'name'
    res.body.forEach((role) => {
      expect(role).toHaveProperty('id')
      expect(role).toHaveProperty('name')
    })
  })

  it('should return 404 if no roles are found', async () => {
    // Clean up any roles in DB to simulate no roles
    await Role.destroy({ where: {}, force: true })

    const res = await request.get('/api/roles')

    // Expect 404 status code
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Roles not found') // Assumes your error message is consistent
  })
})
