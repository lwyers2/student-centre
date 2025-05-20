const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { User, Student, StudentModule, ModuleYear, Module, Semester, AuthenticationUser } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/students/:student/modules', () => {
  let testUser, token, testStudent, testModule, testModuleYear, testStudentModule, authenticationUser, semester

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)
    testUser = await User.create({
      email: 'test@qub.ac.uk',
      password: hashedPassword,
      forename: 'Alice',
      surname: 'Smith',
      active: 1,
      prefix: 'Dr',
      job_title: 'Professor',
      role_id: 3,
    })

    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    authenticationUser = await AuthenticationUser.findOne({ where: { token } })

    semester = await Semester.create({
      name: 'Winter'
    })

    testStudent = await Student.create({
      forename: 'John',
      surname: 'Doe',
      student_code: 'S12345',
      email: 'john.doe@qub.ac.uk',
    })

    testModule = await Module.create({
      title: 'Mathematics',
      year: 1,
      code: 'MATH101',
      CATs: 20,
      semester_id: semester.id
    })

    testModuleYear = await ModuleYear.create({
      year_start: 2024,
      semester_id: 1,
      module_coordinator_id: testUser.id,
      module_id: testModule.id,
    })

    testStudentModule = await StudentModule.create({
      student_id: testStudent.id,
      module_year_id: testModuleYear.id,
      module_id: testModule.id,
      result: 15,
      resit: 0,
      flagged: 0,
      descriptor_id: 1,
    })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { user_id: authenticationUser.user_id } }
    )
  })

  it('should return student module data if authorized', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/modules`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('modules')
    expect(response.body.modules[0]).toHaveProperty('module_year_id', testModuleYear.id)
    expect(response.body.modules[0]).toHaveProperty('module_id', testModule.id)
    expect(response.body.modules[0]).toHaveProperty('result', testStudentModule.result)
    expect(response.body.modules[0]).toHaveProperty('module_coordinator', 'Dr. Alice Smith')
  })

  it('should return 404 if student modules are not found', async () => {
    const nonExistentStudentId = 9999
    const response = await supertest(app)
      .get(`/api/students/${nonExistentStudentId}/modules`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Student not found')
  })



  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/modules`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/modules`)
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })
})
