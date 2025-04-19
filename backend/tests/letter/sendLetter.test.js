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
  Letter
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('POST /letters/send-letter', () => {
  let token, staffUser, student, moduleYear, studentModule

  beforeAll(async () => {
    // Create users and auth
    const hashedPassword = await bcrypt.hash('securepass', 10)
    staffUser = await User.create({
      email: 'staff@qub.ac.uk',
      password: hashedPassword,
      forename: 'Staffy',
      surname: 'McStaff',
      prefix: 'Dr.',
      active: 1,
      role_id: 3,
      job_title: 'Lecturer',
    })

    const auth = await authenticateUser(staffUser.email, 'securepass')
    token = auth.token

    // Setup letter types
    await LetterType.create({ name: '1st Warning' })
    await LetterType.create({ name: '2nd Warning' })

    // Create academic structure
    const course = await Course.create({ title: 'BSc Test', code: 'BST101', years: 3, qualification_id: 1, school_id: 1, part_time: 0 })
    const courseYear = await CourseYear.create({ year_start: 2024, course_id: course.id, year_end: 2025, course_coordinator: staffUser.id })
    const module = await Module.create({ title: 'Test Module', code: 'TM101', year: 1, CATs: 20 })

    moduleYear = await ModuleYear.create({ year_start: 2024, semester_id: 1, module_id: module.id, module_coordinator_id: staffUser.id })
    await ModuleCourse.create({
      module_year_id: moduleYear.id,
      module_id: module.id,
      course_year_id: courseYear.id,
      course_id: course.id,
    })

    student = await Student.create({
      forename: 'Testy',
      surname: 'Student',
      email: 'test@student.com',
      student_code: 'S1234567'
    })

    studentModule = await StudentModule.create({
      student_id: student.id,
      module_year_id: moduleYear.id,
      module_id: module.id,
      result: 32,
      flagged: true,
      descriptor_id: 1,
      resit: 0
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

  it('should send a 1st warning letter successfully', async () => {
    const response = await supertest(app)
      .post('/api/letters/send-letter')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        moduleYearId: moduleYear.id,
        sentByUser: staffUser.id,
        authorisedByStaff: staffUser.id
      })

    expect(response.status).toBe(200)
    expect(response.text).toContain('Letter sent successfully')

    const letters = await Letter.findAll({ where: { student_module_id: studentModule.id } })
    expect(letters.length).toBe(1)
  })

  it('should not send a second letter for the same module', async () => {
    const response = await supertest(app)
      .post('/api/letters/send-letter')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        moduleYearId: moduleYear.id,
        sentByUser: staffUser.id,
        authorisedByStaff: staffUser.id
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe('Maximum number of failure letters already sent for module.')
  })
})
