const supertest = require('supertest')
const path = require('path')
const fs = require('fs')
const app = require('../../app') // adjust path if needed
const { Meeting, User, Student, Module, ModuleYear, Course, CourseYear } = require('../../models')


describe('POST /upload/meeting-minutes', () => {
  let testMeeting, adminStaff, teachingStaff, testStudent, testModule, testModuleYear, testCourse, testCourseYear
  let uploadedFilePath = ''

  beforeAll(async () => {

    adminStaff = await User.create({
      prefix: 'Mr',
      forename: 'admin',
      surname: 'staff',
      email: 'a.staff@qub.ac.uk',
      password: 'password',
      role_id: 1,
      active: 1,
      job_title: 'Admin Staff',
    })

    teachingStaff = await User.create({
      prefix: 'Dr',
      forename: 'teaching',
      surname: 'staff',
      email: 't.staff@qub.ac.uk',
      password: 'password',
      role_id: 2,
      active: 1,
      job_title: 'Teacher',
    })

    testStudent = await Student.create({
      forename: 'Test',
      surname: 'Student',
      email: 't.student@qub.ac.uk',
      student_code: 'S000012',
    })



    testModule = await Module.create({
      code: 'TEST1234',
      title: 'Test Module',
      CATs: 20,
      year:1,
    })

    testModuleYear = await ModuleYear.create({
      module_id: testModule.id,
      year_start: 2023,
      semester_id: 1,
      module_coordinator_id: teachingStaff.id,
    })

    testCourse = await Course.create({
      title: 'Test Course',
      code: 'TEST1234',
      years: 3,
      school_id: 1,
      qualification_id: 1,
      part_time: 0,
    })

    testCourseYear = await CourseYear.create({
      course_id: testCourse.id,
      year_start: 2023,
      year_end: 2025,
      course_coordinator: teachingStaff.id,
    })


    testMeeting = await Meeting.create({
      student_id: testStudent.id,
      academic_id: teachingStaff.id,
      admin_staff_id: adminStaff.id,
      outcome: 'PEN',
      meeting_reason: 'Test Reason',
      module_year_id: testModuleYear.id,
      course_year_id: testCourseYear.id,
      scheduled_date: new Date(),
      path_to_minutes: null,
    })

    // Ensure upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  })

  afterAll(async () => {
    // Cleanup DB entry
    if (testMeeting) {
      await Meeting.destroy({ where: { id: testMeeting.id }, force: true })
    }

    // Delete uploaded file if exists
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath)
    }
  })

  it('should upload a meeting minutes file and update meeting record', async () => {
    const res = await supertest(app)
      .post('/api/upload/meeting-minutes')
      .field('meetingId', testMeeting.id.toString())
      .attach('file', path.join(__dirname, '../testFiles/minutes_sample.docx'))

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.filePath).toContain('/uploads/')
    expect(res.body.meeting.id).toBe(testMeeting.id)

    // Save path for cleanup
    uploadedFilePath = path.join(__dirname, '../../', res.body.filePath)
  })

  it('should return 404 if meeting not found', async () => {
    const res = await supertest(app)
      .post('/api/upload/meeting-minutes')
      .field('meetingId', '999999') // non-existent meeting
      .attach('file', path.join(__dirname, '../testFiles/minutes_sample.docx'))

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Meeting not found')
  })

  it('should return 400 if no file is uploaded', async () => {
    const res = await supertest(app)
      .post('/api/upload/meeting-minutes')
      .field('meetingId', testMeeting.id.toString())

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('No file uploaded')
  })
})
