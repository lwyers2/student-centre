const supertest = require('supertest')
const app = require('../../app')
const { Role } = require('../../models')
const request = supertest(app)

describe('GET /api/roles', () => {
  beforeAll(async () => {
    await Role.create({ name: 'Admin' })
    await Role.create({ name: 'User' })
  })

  afterAll(async () => {
    await Role.destroy({ where: {}, force: true })
  })

  it('should return all roles', async () => {
    const res = await request.get('/api/roles')

    expect(res.status).toBe(200)

    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBeGreaterThan(0)

    res.body.forEach((role) => {
      expect(role).toHaveProperty('id')
      expect(role).toHaveProperty('name')
    })
  })

  it('should return 404 if no roles are found', async () => {
    await Role.destroy({ where: {}, force: true })

    const res = await request.get('/api/roles')

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Roles not found')
  })
})
