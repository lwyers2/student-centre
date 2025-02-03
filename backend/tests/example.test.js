// test/classifications.test.js
const request = require('supertest')
const app = require('../app') // Your Express app

describe('GET /api/classifications', () => {
  it('should return all classifications', async () => {
    const response = await request(app).get('/api/classifications')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(9) // Expect 9 classifications seeded
  })
})
