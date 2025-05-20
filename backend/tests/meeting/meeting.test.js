const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')
const {
  User,
  Student,
  Module,
  ModuleYear,
  Course,
  CourseYear,
  Meeting,
  ModuleCourse,
  Letter,
  StudentModule,
  LetterType,
  AuthenticationUser
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET, POST, DELETE, PUT /api/meetings - Meeting Routes', () => {
  let token, academicUser, adminUser, student, courseYear, moduleYear, studentModule, createdMeeting

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password', 10)

    academicUser = await User.create({
      email: 'u.super@qub.ac.uk',
      password: hashedPassword,
      forename: 'User',
      surname: 'Super',
      prefix: 'Dr.',
      active: 1,
      role_id: 3,
      job_title: 'Lecturer'
    })

    adminUser = await User.create({
      email: 'u.admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'User',
      surname: 'Admin',
      prefix: 'Ms.',
      active: 1,
      role_id: 2,
      job_title: 'Admin Staff'
    })

    const auth = await authenticateUser(academicUser.email, 'password')
    token = auth.token

    const course = await Course.create({
      title: 'Computing',
      code: 'CS101',
      years: 3,
      qualification_id: 1,
      school_id: 1,
      part_time: 0
    })

    courseYear = await CourseYear.create({
      year_start: 2024,
      year_end: 2025,
      course_id: course.id,
      course_coordinator: academicUser.id
    })

    const module = await Module.create({
      title: 'Foundations of Computing',
      code: 'FCS101',
      year: 1,
      CATs: 20
    })

    moduleYear = await ModuleYear.create({
      year_start: 2024,
      semester_id: 1,
      module_id: module.id,
      module_coordinator_id: academicUser.id
    })

    await ModuleCourse.create({
      module_year_id: moduleYear.id,
      module_id: module.id,
      course_year_id: courseYear.id,
      course_id: course.id
    })

    student = await Student.create({
      forename: 'Student',
      surname: 'Name',
      email: 's.name@qub.ac.uk',
      student_code: 'S123456789'
    })

    studentModule = await StudentModule.create({
      student_id: student.id,
      module_year_id: moduleYear.id,
      module_id: module.id,
      result: 25,
      flagged: true,
      descriptor_id: 1,
      resit: 0,
    })

    const letterType = await LetterType.create({ name: '1st Warning' })
    await Letter.bulkCreate([
      {
        type_id: letterType.id,
        student_module_id: studentModule.id,
        sent_by_user: academicUser.id,
        authorised_by_staff_id: academicUser.id,
        authorised_by_staff: academicUser.id,
        date_sent: new Date(),
        sent: 1
      },
      {
        type_id: letterType.id,
        student_module_id: studentModule.id,
        sent_by_user: academicUser.id,
        authorised_by_staff_id: academicUser.id,
        authorised_by_staff: academicUser.id,
        date_sent: new Date(),
        sent: 1
      }
    ])
  })

  afterAll(async () => {
    await Meeting.destroy({ where: {} })
    await Letter.destroy({ where: {} })
    await LetterType.destroy({ where: {} })
    await StudentModule.destroy({ where: {} })
    await Student.destroy({ where: {} })
    await ModuleCourse.destroy({ where: {} })
    await ModuleYear.destroy({ where: {} })
    await Module.destroy({ where: {} })
    await CourseYear.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await AuthenticationUser.destroy({ where: { user_id: academicUser.id } })
    await User.destroy({ where: { id: academicUser.id }, force: true })
    await User.destroy({ where: { id: adminUser.id }, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('POST /create: creates a meeting if student has 2+ letters', async () => {
    const payload = {
      studentId: student.id,
      moduleYearId: moduleYear.id,
      scheduledDate: new Date().toISOString(),
      academicId: academicUser.id,
      adminStaffId: adminUser.id,
      meetingReason: 'Persistent non-attendance',
      courseYearId: courseYear.id
    }

    const response = await supertest(app)
      .post('/api/meetings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    createdMeeting = response.body.meeting
  })

  it('GET /:meetingId: fetches a meeting by ID', async () => {
    const response = await supertest(app)
      .get(`/api/meetings/${createdMeeting.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', createdMeeting.id)
    expect(response.body.meeting_student).toHaveProperty('id', student.id)
  })

  it('PUT /update/:meetingId: updates a meeting', async () => {
    const updatedData = {
      outcome: 'Meeting went well',
      scheduled_date: new Date().toISOString(),
      meeting_reason: 'Updated reason',
      academic_id: academicUser.id,
      admin_staff_id: adminUser.id
    }

    const response = await supertest(app)
      .put(`/api/meetings/update/${createdMeeting.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.meeting.outcome).toBe('Meeting went well')
  })

  it('GET /user/:userId: gets all meetings for an academic/admin user', async () => {
    const response = await supertest(app)
      .get(`/api/meetings/user/${academicUser.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body[0]).toHaveProperty('id', createdMeeting.id)
  })

  it('GET /student/:studentId: gets all meetings for a student', async () => {
    const response = await supertest(app)
      .get(`/api/meetings/student/${student.id}`)
      .set('Authorization', `Bearer ${token}`)


    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty('id', student.id)
  })

  it('DELETE /delete/:meetingId: deletes a meeting', async () => {
    const response = await supertest(app)
      .delete(`/api/meetings/delete/${createdMeeting.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Meeting deleted successfully')
  })
})
