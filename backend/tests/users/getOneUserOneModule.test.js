const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')

const {
  User,
  AuthenticationUser,
  UserModule,
  Module,
  ModuleYear,
  Semester,
  ModuleCourse,
  CourseYear,
  Course,
  QualificationLevel,
  StudentModule,
  ResultDescriptor,
  Student,
} = require('../../models')

const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/users/:user/module/:module', () => {
  let superUser, token, module, moduleYear, semester, course, courseYear, qualificationLevel, student

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create user
    superUser = await User.create({
      email: 'superuser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Module',
      surname: 'Tester',
      active: 1,
      prefix: 'Dr',
      job_title: 'Lecturer',
      role_id: 3, // Super User
    })

    const result = await authenticateUser(superUser.email, 'password123')
    token = result.token

    // Related entities
    semester = await Semester.create({ name: 'Semester 1' })

    qualificationLevel = await QualificationLevel.create({ qualification: 'BSc', level_id: 1 })

    course = await Course.create({
      title: 'Software Engineering',
      code: 'SE101',
      part_time: false,
      qualification_id: qualificationLevel.id,
      school_id: 1,
      years: 3,
    })

    courseYear = await CourseYear.create({
      year_start: 2023,
      year_end: 2024,
      course_id: course.id,
      course_coordinator: superUser.id,
    })

    module = await Module.create({
      title: 'Web Development',
      code: 'WD300',
      year: 2023,
      CATs: 20,
    })

    moduleYear = await ModuleYear.create({
      module_id: module.id,
      module_coordinator_id: superUser.id,
      semester_id: semester.id,
      year_start: 2023,
    })

    await ModuleCourse.create({
      module_id: module.id,
      course_id: course.id,
      course_year_id: courseYear.id,
      module_year_id: moduleYear.id,
    })

    await UserModule.create({
      user_id: superUser.id,
      module_id: module.id,
      module_year_id: moduleYear.id,
    })

    // Optional: Add a student module and result descriptor to trigger the deeper nested include
    const resultDescriptor = await ResultDescriptor.create({ descriptor: 'ABS', description: 'Absent' })


    student = await Student.create({
      forename: 'Test',
      surname: 'Student',
      email: 'testStudent@qub.ac.uk',
      student_code: 'S1234567',
    })

    await StudentModule.create({
      student_id: student.id,
      module_year_id: moduleYear.id,
      result: 65,
      flagged: false,
      resit: false,
      descriptor_id: resultDescriptor.id,
      module_id: module.id,
    })
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: { user_id: superUser.id } })
    await StudentModule.destroy({ where: {} })
    await ResultDescriptor.destroy({ where: {} })
    await UserModule.destroy({ where: {} })
    await ModuleCourse.destroy({ where: {} })
    await ModuleYear.destroy({ where: {} })
    await Module.destroy({ where: {} })
    await CourseYear.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await QualificationLevel.destroy({ where: {} })
    await Semester.destroy({ where: {} })
    await User.destroy({ where: { id: superUser.id }, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return module details for a user if authorized', async () => {
    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/module/${module.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', superUser.id)
    expect(res.body).toHaveProperty('forename', 'Module')
    expect(res.body).toHaveProperty('module')
    expect(res.body.module).toHaveProperty('title', 'Web Development')
    expect(res.body.module).toHaveProperty('code', 'WD300')
  })

  it('should return 404 if user or module not found', async () => {
    const res = await supertest(app)
      .get(`/api/users/999999/module/${module.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message || res.text).toMatch(/User not found/i)
  })

  it('should return 401 if no token is provided', async () => {
    const res = await supertest(app).get(`/api/users/${superUser.id}/module/${module.id}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 if token is expired', async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() - 3600 * 1000) },
      { where: { token } }
    )

    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/module/${module.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token expired')
  })

  it('should return 401 if token is deactivated', async () => {
    await AuthenticationUser.update({ is_active: false }, { where: { token } })

    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/module/${module.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token invalid')
  })

  it('should return 401 if token format is incorrect', async () => {
    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/module/${module.id}`)
      .set('Authorization', 'WrongFormatToken')

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })
})
