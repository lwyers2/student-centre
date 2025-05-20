const supertest = require('supertest')
const path = require('path')
const fs = require('fs/promises')
const bcrypt = require('bcrypt')
const app = require('../../app')
const { Meeting, User, AuthenticationUser, Student, Course, CourseYear, Module, ModuleYear } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/download/meeting-minutes/:meetingId', () => {
  let testUser, token, meeting, filePath, testStudent, testModule, testModuleYear, testCourse, testCourseYear

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)


    testUser = await User.create({
      email: 'filetest@qub.ac.uk',
      password: hashedPassword,
      forename: 'File',
      surname: 'Tester',
      prefix: 'Ms',
      job_title: 'Clerk',
      role_id: 3,
      active: 1,
    })

    testStudent = await Student.create({
      forename: 'Test',
      surname: 'Student',
      student_code: '123456',
      email: 'test@qub.ac.uk',
    })

    testCourse = await Course.create({
      title: 'Test Course',
      code: 'TC101',
      years: 3,
      part_time: false,
      qualification_id: 1,
      school_id: 1,
    })

    testCourseYear = await CourseYear.create({
      course_id: testCourse.id,
      year_start: 2023,
      year_end: 2024,
      course_coordinator: testUser.id,
    })

    testModule = await Module.create({
      title: 'Test Module',
      code: 'TM101',
      CATs: 20,
      year: 1,
    })
    testModuleYear = await ModuleYear.create({
      module_id: testModule.id,
      year_start: 2023,
      semester_id: 1,
      module_coordinator_id: testUser.id,
    })

    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })

    // file upload
    const uploadsDir = path.join(__dirname, '../../uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const fakeDocPath = path.join(uploadsDir, 'test_minutes.docx')
    await fs.writeFile(fakeDocPath, 'This is a test DOCX file.')

    //test minutes file
    filePath = '/uploads/test_minutes.docx'

    meeting = await Meeting.create({
      title: 'Test Meeting',
      scheduled_date: new Date(),
      path_to_minutes: filePath,
      academic_id: testUser.id,
      admin_staff_id: testUser.id,
      student_id: testStudent.id,
      outcome: 'Test outcome',
      meeting_reason: 'Test reason',
      module_year_id: testModuleYear.id,
      course_year_id: testCourseYear.id,

    })
  })

  afterAll(async () => {
    const absolutePath = path.join(__dirname, '../../', filePath)
    await fs.unlink(absolutePath)

    await Meeting.destroy({ where: { id: meeting.id } })
    await AuthenticationUser.destroy({ where: { token } })
    await User.destroy({ where: { id: testUser.id }, force: true })
  })

  it('should return the meeting minutes file with correct headers', async () => {
    const response = await supertest(app)
      .get(`/api/download/meeting-minutes/${meeting.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.headers['content-disposition']).toMatch(/attachment/)
    expect(response.headers['content-type']).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    expect(response.text).toContain('This is a test DOCX file.')
  })

  it('should return 404 if meeting does not exist', async () => {
    const response = await supertest(app)
      .get('/api/download/meeting-minutes/999999')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Meeting minutes not found')
  })

  it('should return 404 if file path is invalid', async () => {
    const brokenMeeting = await Meeting.create({
      title: 'Broken File Meeting',
      scheduled_date: new Date(),
      path_to_minutes: '/uploads/this_does_not_exist.docx',
      academic_id: testUser.id,
      admin_staff_id: testUser.id,
      student_id: testStudent.id,
      outcome: 'Test outcome',
      meeting_reason: 'Test reason',
      module_year_id: testModuleYear.id,
      course_year_id: testCourseYear.id,
    })

    const response = await supertest(app)
      .get(`/api/download/meeting-minutes/${brokenMeeting.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('File not found on the server')

    await brokenMeeting.destroy()
  })

  it('should return 401 if token is missing', async () => {
    const response = await supertest(app)
      .get(`/api/download/meeting-minutes/${meeting.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })
})
