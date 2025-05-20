const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  AuthenticationUser,
  UserModule,
  Module,
  ModuleCourse,
  UserCourse,
  Course,
  QualificationLevel,
  CourseYear,
  ModuleYear
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/users/:user/modules', () => {
  let superUser
  let token


  let module,  course,  moduleYear, courseYear, qualificationLevel

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    superUser = await User.create({
      email: 'superuser@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      active: 1,
      prefix: 'Dr',
      job_title: 'Lecturer',
      role_id: 3,
    })

    // Auth and token
    const result = await authenticateUser(superUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })

    // Related models for modules + course
    qualificationLevel = await QualificationLevel.create({ qualification: 'BSc', level_id: 1 })
    course = await Course.create({
      title: 'Computer Science',
      code: 'CS100',
      part_time: false,
      qualification_id: qualificationLevel.id,
      school_id:1,
      years: 3
    })

    courseYear = await CourseYear.create({
      year_start: 2022,
      year_end: 2023,
      course_id: course.id,
      course_coordinator: superUser.id,
    })


    await UserCourse.create({
      user_id: superUser.id,
      course_id: course.id,
      course_year_id: courseYear.id,
    })

    module = await Module.create({
      title: 'Algorithms',
      code: 'CS200',
      year: 2023,
      CATs: 20,
    })

    moduleYear = await ModuleYear.create({
      module_id: module.id,
      module_coordinator_id: superUser.id,
      semester_id: 1,
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
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: { user_id: superUser.id } })
    await UserModule.destroy({ where: { user_id: superUser.id } })
    await ModuleCourse.destroy({ where: { module_id: module.id } })
    await Module.destroy({ where: { id: module.id } })
    await UserCourse.destroy({ where: { user_id: superUser.id } })
    await CourseYear.destroy({ where: { id: courseYear.id } })
    await Course.destroy({ where: { id: course.id } })
    await QualificationLevel.destroy({ where: { id: qualificationLevel.id } })
    await User.destroy({ where: { id: superUser.id }, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return user with modules if authorized', async () => {
    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/modules`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user).toHaveProperty('id', superUser.id)
    expect(Array.isArray(res.body.modules)).toBe(true)
    expect(res.body.modules.length).toBeGreaterThan(0)
    expect(res.body.modules[0]).toHaveProperty('title', 'Algorithms')
  })

  it('should return 404 if user does not exist', async () => {
    const nonExistentId = 999999
    const res = await supertest(app)
      .get(`/api/users/${nonExistentId}/modules`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message || res.text).toMatch(/User not found/i)
  })

  it('should return 401 if no token is provided', async () => {
    const res = await supertest(app).get(`/api/users/${superUser.id}/modules`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 if token is expired', async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() - 3600 * 1000) },
      { where: { token } }
    )

    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/modules`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token expired')
  })

  it('should return 401 if token is deactivated', async () => {
    await AuthenticationUser.update(
      { is_active: false },
      { where: { token } }
    )

    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/modules`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token invalid')
  })

  it('should return 401 if token format is incorrect', async () => {
    const res = await supertest(app)
      .get(`/api/users/${superUser.id}/modules`)
      .set('Authorization', 'WrongFormatToken')

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })
})
