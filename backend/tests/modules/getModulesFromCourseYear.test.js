const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')

const {
  User,
  Module,
  ModuleYear,
  Course,
  CourseYear,
  ModuleCourse,
  Semester,
  AuthenticationUser
} = require('../../models')

const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/modules/course-year/:courseYearId', () => {
  let superUser, token, courseYear, module, moduleYear, semester

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('superpass', 10)

    superUser = await User.create({
      email: 'super@qub.ac.uk',
      password: hashedPassword,
      forename: 'Sam',
      surname: 'Super',
      prefix: 'Mx',
      active: 1,
      role_id: 3, // Super User
      job_title: 'Sys Admin'
    })

    const auth = await authenticateUser(superUser.email, 'superpass')
    token = auth.token

    const course = await Course.create({
      title: 'Theoretical Sciences',
      code: 'TS101',
      years: 3,
      qualification_id: 1,
      school_id: 1,
      part_time: false
    })

    courseYear = await CourseYear.create({
      year_start: 2024,
      year_end: 2025,
      course_id: course.id,
      course_coordinator: superUser.id
    })

    module = await Module.create({
      title: 'Astrophysics',
      code: 'AST301',
      year: 3,
      CATs: '30'
    })

    semester = await Semester.create({ name: 'Semester 1' })

    moduleYear = await ModuleYear.create({
      year_start: 2024,
      semester_id: semester.id,
      module_id: module.id,
      module_coordinator_id: superUser.id
    })

    await ModuleCourse.create({
      module_year_id: moduleYear.id,
      module_id: module.id,
      course_year_id: courseYear.id,
      course_id: course.id
    })
  })

  afterAll(async () => {
    await ModuleCourse.destroy({ where: {} })
    await ModuleYear.destroy({ where: {} })
    await Module.destroy({ where: {} })
    await Semester.destroy({ where: {} })
    await CourseYear.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await AuthenticationUser.destroy({ where: { user_id: superUser.id } })
    await User.destroy({ where: { id: superUser.id }, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return modules linked to a course year', async () => {
    const res = await supertest(app)
      .get(`/api/modules/course-year/${courseYear.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)

    expect(res.body[0]).toHaveProperty('title', 'Astrophysics')
    expect(res.body[0]).toHaveProperty('code', 'AST301')
    expect(res.body[0]).toHaveProperty('year_start', 2024)
    expect(res.body[0]).toHaveProperty('semester','Semester 1')
  })

  it('should return 404 if no modules found for course year', async () => {
    const res = await supertest(app)
      .get('/api/modules/course-year/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Modules not found')
  })

  it('should block access for non-super users', async () => {
    const normalUser = await User.create({
      email: 'notsuper@qub.ac.uk',
      password: await bcrypt.hash('nopepass', 10),
      forename: 'Nina',
      surname: 'Normal',
      prefix: 'Dr.',
      active: 1,
      role_id: 1, // Not Super User
      job_title: 'Lecturer'
    })

    const auth = await authenticateUser(normalUser.email, 'nopepass')
    const badToken = auth.token

    const res = await supertest(app)
      .get(`/api/modules/course-year/${courseYear.id}`)
      .set('Authorization', `Bearer ${badToken}`)

    expect(res.status).toBe(403)

    await AuthenticationUser.destroy({ where: { user_id: normalUser.id } })
    await User.destroy({ where: { id: normalUser.id }, force: true })
  })
})
