const supertest = require('supertest')
const path = require('path')
const fs = require('fs')
const app = require('../../app')
const { Student, Course, CourseYear, StudentCourse, StudentModule, User } = require('../../models')

describe('POST /upload/students', () => {
  let testCourse, testCourseCoordinator
  let uploadedFilePath = ''

  beforeAll(async () => {

    testCourseCoordinator = await User.create({
      prefix: 'Dr',
      forename: 'Course',
      surname: 'Coordinator',
      email: 'c.c@qub.ac.uk',
      password: 'password',
      role_id: 2,
      active: 1,
      job_title: 'Course Coordinator',
    })

    testCourse = await Course.create({
      title: 'Test Course',
      code: 'TEST1234',
      years: 3,
      school_id: 1,
      qualification_id: 1,
      part_time: 0,
    })

    await CourseYear.create({
      course_id: testCourse.id,
      year_start: 2023,
      year_end: 2025,
      course_coordinator: testCourseCoordinator.id,
    })

    // upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  })

  afterAll(async () => {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath)
    }

    await Student.destroy({ where: {}, force: true })
    await StudentCourse.destroy({ where: {}, force: true })
    await StudentModule.destroy({ where: {}, force: true })
    await CourseYear.destroy({ where: {}, force: true })
    await Course.destroy({ where: {}, force: true })
  })

  it('should upload a student CSV and process the records correctly', async () => {
    const res = await supertest(app)
      .post('/api/upload/students')
      .attach('file', path.join(__dirname, '../testFiles/students_sample.csv'))

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe('CSV uploaded and processed successfully')
  })

  it('should return 400 if no file is uploaded', async () => {
    const res = await supertest(app)
      .post('/api/upload/students')

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('No file uploaded')
  })

  it('should return 500 if the CSV has missing required fields', async () => {
    const res = await supertest(app)
      .post('/api/upload/students')
      .attach('file', path.join(__dirname, '../testFiles/students_invalid_sample.csv'))

    expect(res.statusCode).toBe(500)
    expect(res.body.message).toContain('Missing data found in some rows')
  })

  it('should handle invalid course or course year gracefully', async () => {
    const invalidCSV = path.join(__dirname, '../testFiles/students_invalid_course_sample.csv')

    const res = await supertest(app)
      .post('/api/upload/students')
      .attach('file', invalidCSV)

    expect(res.statusCode).toBe(500)
    expect(res.body.message).toContain('Course not found: Course Invalid')
  })
})
