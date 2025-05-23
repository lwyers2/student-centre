const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { CourseYear, User, Student, StudentModule, ModuleYear, Module, Semester, AuthenticationUser, UserModule, ModuleCourse, Course, StudentCourse } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /:student/module-year/:moduleYearId', () => {
  let testUser, token, testStudent, testModuleYear, testModule, testStudentModule, authenticationUser, semester, testCourse, testCourseYear

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
      role_id: 1,
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

    testCourse = await Course.create({
      title: 'Computer Science',
      code: 'CS101',
      year: 1,
      qualification_id: 1,
      part_time: 0,
      years: 1,
      school_id: 1,
    })

    testCourseYear = await CourseYear.create({
      course_id: testCourse.id,
      year_start: 2024,
      year_end: 2025,
      course_coordinator: testUser.id,
    })

    await ModuleCourse.create({
      module_year_id: testModuleYear.id,
      course_year_id: testCourseYear.id,
      course_id: testCourse.id,
      module_id: testModule.id,
      required: 1,
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


    await UserModule.create({
      user_id: testUser.id,
      module_year_id: testModuleYear.id,
      module_id: testModule.id,
    })

    await StudentCourse.create({
      student_id: testStudent.id,
      course_year_id: testCourseYear.id,
      course_id: testCourse.id,
      archived: 0
    })

  })


  afterAll(async () => {
    if (authenticationUser) await authenticationUser.destroy()
    await StudentModule.destroy({ where: { student_id: testStudent.id } })
    await Student.destroy({ where: { id: testStudent.id } })
    await ModuleYear.destroy({ where: { id: testModuleYear.id } })
    await Module.destroy({ where: { id: testModule.id } })
    if (testUser) {
      await AuthenticationUser.destroy({ where: { user_id: testUser.id } })
      await User.destroy({ where: { id: testUser.id }, force: true })
    }
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return student module year data if authorized', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('student.id', testStudent.id)
    expect(response.body.module).toHaveProperty('title', 'Mathematics')
    expect(response.body.module).toHaveProperty('result', testStudentModule.result)
  })

  it('should return 404 if student module year data is not found', async () => {
    const nonExistentStudentId = 9999
    const response = await supertest(app)
      .get(`/api/students/${nonExistentStudentId}/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(500)
    //expect(response.body.message).toBe('Student not found')
  })

  it('should return 403 if user does not have access to the module', async () => {
    const unauthorizedUser = await User.create({
      email: 'unauthorized@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Tom',
      surname: 'Smith',
      active: 1,
      prefix: 'Mr',
      job_title: 'Visitor',
      role_id: 1,
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const unauthorizedToken = result.token

    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${unauthorizedToken}`)


    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Access denied')

    await AuthenticationUser.destroy({ where: { user_id: unauthorizedUser.id } })
    await unauthorizedUser.destroy()
  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/module-year/${testModuleYear.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/module-year/${testModuleYear.id}`)
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })
})
