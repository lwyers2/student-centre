const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  Student,
  Module,
  ModuleYear,
  StudentModule,
  ModuleCourse,
  Course,
  CourseYear,
  LetterType,
  AuthenticationUser,
  Letter,
  ResultDescriptor
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/letters?studentId=&moduleYearId=', () => {
  let token, staffUser, student, studentModule, moduleYear

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('securepass', 10)

    staffUser = await User.create({
      email: 'staff3@qub.ac.uk',
      password: hashedPassword,
      forename: 'Maggie',
      surname: 'Moduletest',
      prefix: 'Dr.',
      active: 1,
      role_id: 3,
      job_title: 'Lecturer'
    })

    const auth = await authenticateUser(staffUser.email, 'securepass')
    token = auth.token

    const letterType = await LetterType.create({ name: '2nd Warning' })
    const resultDescriptor = await ResultDescriptor.create({ descriptor: 'FAIL', description: 'Fail' })

    const course = await Course.create({ title: 'BSc Testing', code: 'TST101', years: 3, qualification_id: 1, school_id: 1, part_time: 0 })
    const courseYear = await CourseYear.create({ year_start: 2024, year_end: 2025, course_id: course.id, course_coordinator: staffUser.id })
    const module = await Module.create({ title: 'Testing 101', code: 'TS101', year: 1, CATs: 20 })

    moduleYear = await ModuleYear.create({ year_start: 2024, semester_id: 1, module_id: module.id, module_coordinator_id: staffUser.id })
    await ModuleCourse.create({
      module_year_id: moduleYear.id,
      module_id: module.id,
      course_year_id: courseYear.id,
      course_id: course.id,
    })

    student = await Student.create({
      forename: 'Marty',
      surname: 'McModule',
      email: 'marty@student.com',
      student_code: 'S9876543'
    })

    studentModule = await StudentModule.create({
      student_id: student.id,
      module_year_id: moduleYear.id,
      module_id: module.id,
      result: 28,
      flagged: true,
      descriptor_id: resultDescriptor.id,
      resit: 0
    })

    await Letter.create({
      type_id: letterType.id,
      student_module_id: studentModule.id,
      sent_by_user: staffUser.id,
      authorised_by_staff: staffUser.id,
      date_sent: new Date(),
      sent: 1
    })
  })

  afterAll(async () => {
    await Letter.destroy({ where: {} })
    await StudentModule.destroy({ where: {} })
    await Student.destroy({ where: {} })
    await ModuleCourse.destroy({ where: {} })
    await ModuleYear.destroy({ where: {} })
    await Module.destroy({ where: {} })
    await CourseYear.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await ResultDescriptor.destroy({ where: {} })
    await LetterType.destroy({ where: {} })
    await AuthenticationUser.destroy({ where: { user_id: staffUser.id } })
    await User.destroy({ where: { id: staffUser.id }, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return letters for a student for one moduleYear', async () => {
    const response = await supertest(app)
      .get(`/api/letters?studentId=${student.id}&moduleYearId=${moduleYear.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)

    const letter = response.body[0]
    expect(letter).toHaveProperty('type')
    expect(letter).toHaveProperty('sent_by')
    expect(letter).toHaveProperty('authorised_by')
    expect(letter).toHaveProperty('module')
  })

  it('should return 400 if query params are missing', async () => {
    const response = await supertest(app)
      .get('/api/letters') // No query params
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'Missing studentId or moduleYearId')
  })
})
