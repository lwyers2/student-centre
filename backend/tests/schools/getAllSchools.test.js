const supertest = require('supertest')
const app = require('../../app') // Adjust the path if necessary
const { School } = require('../../models') // Adjust path if necessary

describe('GET /schools', () => {

  // Before running tests, we can populate the database with some dummy schools
  beforeAll(async () => {
    // Create some dummy schools
    await School.bulkCreate([
      { school_name: 'School A' },
      { school_name: 'School B' },
      { school_name: 'School C' },
    ])
  })

  afterAll(async () => {
    // Clean up after tests
    await School.destroy({ where: {} })
  })

  it('should return a list of schools', async () => {
    const res = await supertest(app)
      .get('/api/schools') // Adjust this path if necessary
      .expect(200) // Expect a successful response

    expect(res.body).toBeInstanceOf(Array) // Should be an array
    expect(res.body.length).toBeGreaterThan(0) // Should have at least 1 school
    expect(res.body[0]).toHaveProperty('id') // Each school should have an id
    expect(res.body[0]).toHaveProperty('school_name') // Each school should have a name
  })

  it('should return a 404 if no schools are found', async () => {
    // First, delete all schools
    await School.destroy({ where: {} })

    const res = await supertest(app)
      .get('/api/schools') // Adjust this path if necessary
      .expect(404) // Expect a not found status

    expect(res.body).toHaveProperty('error', 'Schools not found')
  })
})
