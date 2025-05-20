const supertest = require('supertest')
const app = require('../../app')
const { School } = require('../../models')

describe('GET /schools', () => {

  beforeAll(async () => {
    await School.bulkCreate([
      { school_name: 'School A' },
      { school_name: 'School B' },
      { school_name: 'School C' },
    ])
  })

  afterAll(async () => {
    await School.destroy({ where: {} })
  })

  it('should return a list of schools', async () => {
    const res = await supertest(app)
      .get('/api/schools')
      .expect(200)

    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('school_name')
  })

  it('should return a 404 if no schools are found', async () => {
    await School.destroy({ where: {} })

    const res = await supertest(app)
      .get('/api/schools')
      .expect(404)

    expect(res.body).toHaveProperty('error', 'Schools not found')
  })
})
