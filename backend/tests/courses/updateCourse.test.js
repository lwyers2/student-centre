const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Your main app file
const { User, Course, Role, AuthenticationUser, QualificationLevel } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('PUT /api/courses/edit-course/:courseId', () => {
  let testUser
  let token
  let courseInstance
  let role
  let qualificationLevel

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create test user (Super User role)
    role = await Role.create({ name: 'Super User' })

    testUser = await User.create({
      email: 'superuser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Super',
      surname: 'User',
      prefix: 'Mr',
      job_title: 'Admin',
      role_id: role.id,
      active: 1
    })

    // Authenticate and get token
    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )

    // Create a qualification level
    qualificationLevel = await QualificationLevel.create({
      qualification: 'BEng',
      level_id: 1
    })

    // Create a course
    courseInstance = await Course.create({
      title: 'Civil Engineering',
      code: 'CIV100',
      years: 3,
      part_time: false,
      school_id: 1,
      qualification_id: qualificationLevel.id
    })
  })

  it('should successfully update the course', async () => {
    const response = await supertest(app)
      .put(`/api/courses/edit-course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Civil Engineering - Updated',
        code: 'CIV200',
        qualification: 'BEng',
        part_time: true
      })

    expect(response.status).toBe(200)
    expect(response.body.title).toBe('Civil Engineering - Updated')
    expect(response.body.code).toBe('CIV200')
    expect(response.body.part_time).toBe(1)
  })

  it('should return 404 if course does not exist', async () => {
    const response = await supertest(app)
      .put('/api/courses/edit-course/999999') // Non-existent ID
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Ghost Course',
        code: 'GHOST100',
        qualification: 'BEng',
        part_time: false
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course not found')
  })

  it('should return 400 if required fields are missing', async () => {
    const response = await supertest(app)
      .put(`/api/courses/edit-course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        code: '',
        qualification: ''
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields: title, code or qualification')
  })

  it('should return 404 if qualification level does not exist', async () => {
    const response = await supertest(app)
      .put(`/api/courses/edit-course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Course',
        code: 'NEW101',
        qualification: 'NonExistentQualification',
        part_time: false
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Qualification level not found')
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .put(`/api/courses/edit-course/${courseInstance.id}`)
      .send({
        title: 'Unauthorized Update',
        code: 'UNAUTH100',
        qualification: 'BEng',
        part_time: true
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 403 if user does not have required role', async () => {
    const badUser = await User.create({
      email: 'unauth@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Bad',
      surname: 'User',
      prefix: 'Ms',
      job_title: 'Visitor',
      role_id: 1,
      active: 1
    })

    const result = await authenticateUser(badUser.email, 'password123')
    const badToken = result.token

    const response = await supertest(app)
      .put(`/api/courses/edit-course/${courseInstance.id}`)
      .set('Authorization', `Bearer ${badToken}`)
      .send({
        title: 'Should Not Update',
        code: 'FAIL100',
        qualification: 'BEng',
        part_time: false
      })

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('You are not authorized to access this resource')
  })
})
