const supertest = require('supertest')
const path = require('path')
const fs = require('fs')
const app = require('../../app') // Adjust path if needed
const { Student, Module, ModuleYear, CourseYear, Course, StudentModule, ResultDescriptor, User, ModuleCourse } = require('../../models')

describe('POST /upload/results/:courseYearId', () => {
  let testCourse, testCourseYear, testCourseCoordinator, testStudent, testModule, testModuleYear
  let uploadedFilePath = ''

  // Setup necessary records before tests
  beforeAll(async () => {
    // Create a course coordinator user
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

    // Create a course
    testCourse = await Course.create({
      title: 'Test Course',
      code: 'TEST1234',
      years: 3,
      school_id: 1,
      qualification_id: 1,
      part_time: 0,
    })

    // Create a course year
    testCourseYear = await CourseYear.create({
      course_id: testCourse.id,
      year_start: 2023,
      year_end: 2025,
      course_coordinator: testCourseCoordinator.id,
    })

    testModule = await Module.create({
      code: 'TESTMOD1234',
      title: 'Test Module',
      CATs: 20,
      year: 1,
    })

    testModuleYear = await ModuleYear.create({
      module_id: testModule.id,
      year_start: 2023,
      semester_id: 1,
      module_coordinator_id: testCourseCoordinator.id,
    })

    await ModuleCourse.create({
      module_id: testModule.id,
      course_id: testCourse.id,
      course_year_id: testCourseYear.id,
      module_year_id: testModuleYear.id,
      required: 1
    })

    testStudent = await Student.create({
      forename: 'Test',
      surname: 'Student',
      email: 't.student@qub.ac.uk',
      student_code: 'S000015',
    })

    await StudentModule.create({
      student_id: testStudent.id,
      module_year_id: testModuleYear.id,
      module_id: testModule.id,
      course_year_id: testCourseYear.id,
      result: 0,
      flagged: 0,
      resit: 0,
      descriptor_id: 1,
    })

    // Ensure the upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  })

  afterAll(async () => {
    // Cleanup any test data
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath)
    }

    await Student.destroy({ where: {}, force: true })
    await StudentModule.destroy({ where: {}, force: true })
    await Module.destroy({ where: {}, force: true })
    await ModuleYear.destroy({ where: {}, force: true })
    await ResultDescriptor.destroy({ where: {}, force: true })
    await CourseYear.destroy({ where: {}, force: true })
    await Course.destroy({ where: {}, force: true })
  })

  it('should upload and process results CSV correctly', async () => {
    // Attach a valid CSV file for uploading
    const res = await supertest(app)
      .post(`/api/upload/results/${testCourseYear.id}`)
      .attach('file', path.join(__dirname, '../testFiles/results_sample.csv'))

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe('Course year results processed successfully')
    expect(res.body.stats.updated).toBeGreaterThan(0) // Ensure updates were made
  })

  it('should return 400 if no file is uploaded', async () => {
    const res = await supertest(app)
      .post(`/api/upload/results/${testCourseYear.id}`)

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('No file uploaded')
  })

  it('should return 500 if the CSV has missing required fields', async () => {
    const res = await supertest(app)
      .post(`/api/upload/results/${testCourseYear.id}`)
      .attach('file', path.join(__dirname, '../testFiles/results_invalid_sample.csv'))

    expect(res.statusCode).toBe(500)
    expect(res.body.message).toContain('Missing data found in some rows')
  })

  it('should return 500 if the course year does not exist', async () => {
    const invalidCourseYearId = 99999 // Non-existent course year ID
    const res = await supertest(app)
      .post(`/api/upload/results/${invalidCourseYearId}`)
      .attach('file', path.join(__dirname, '../testFiles/results_sample.csv'))

    expect(res.statusCode).toBe(500)
    expect(res.body.message).toContain('Course year not found')
  })
})
