const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app') // Adjust based on your project structure
const { User, Student, StudentCourse, CourseYear, Course,  AuthenticationUser, School, QualificationLevel } = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /students/:student/courses', () => {
  let testUser, token, testStudent, testCourse, testCourseYear, testStudentCourse, courseCoordinator, testSchool, testQualification

  beforeAll(async () => {
    // Create test user (course coordinator)
    const hashedPassword = await bcrypt.hash('password123', 10)
    testUser = await User.create({
      email: 'test@qub.ac.uk',
      password: hashedPassword,
      forename: 'Alice',
      surname: 'Smith',
      active: 1,
      prefix: 'Dr',
      job_title: 'Professor',
      role_id: 3, // Assuming 'Super User' role or a role with sufficient privileges
    })

    // Authenticate user and get token
    const result = await authenticateUser(testUser.email, 'password123')
    token = result.token


    testSchool = await School.create({
      school_name: 'Test School'
    })

    testQualification = await QualificationLevel.create({
      level_id: 1,
      qualification: 'BASC'
    })

    // Create test student
    testStudent = await Student.create({
      forename: 'John',
      surname: 'Doe',
      student_code: 'S12345',
      email: 'john.doe@qub.ac.uk',
    })

    // Create course and associated data
    courseCoordinator = await User.create({
      forename: 'Course',
      surname: 'Coordinator',
      prefix: 'Dr',
      email: 'course@qub.ac.uk',
      password: hashedPassword,
      active: 1,
      job_title: 'Coordinator',
      role_id: 3,
    })

    testCourse = await Course.create({
      title: 'Mathematics',
      code: 'MATH101',
      years: 3,
      part_time: false,
      school_id: testSchool.id,
      qualification_id: testQualification.id
    })

    testCourseYear = await CourseYear.create({
      year_start: 2024,
      year_end: 2027,
      course_id: testCourse.id,
      course_coordinator: courseCoordinator.id,
    })

    // Create student-course association
    testStudentCourse = await StudentCourse.create({
      student_id: testStudent.id,
      course_year_id: testCourseYear.id,
      course_id: testCourse.id
    })
  })

  beforeEach(async () => {
    // Update token expiration time before each test
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return student course data when a valid student ID is provided', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/courses`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', testStudent.id)
    expect(response.body).toHaveProperty('email', 'john.doe@qub.ac.uk')
    expect(response.body).toHaveProperty('student_code', 'S12345')
    expect(response.body.courses).toBeInstanceOf(Array)
    expect(response.body.courses[0]).toHaveProperty('course_year_id', testCourseYear.id)
    expect(response.body.courses[0]).toHaveProperty('title', 'Mathematics')
    expect(response.body.courses[0]).toHaveProperty('course_year_id', testStudentCourse.course_year_id)
  })

  it('should return 404 if student courses are not found', async () => {
    const nonExistentStudentId = 9999
    const response = await supertest(app)
      .get(`/api/students/${nonExistentStudentId}/courses`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Student not found')
  })

  it('should return 403 if user does not have access to the student data (role issue)', async () => {
    // Create an unauthorized user (e.g., no access to student courses)
    const unauthorizedUser = await User.create({
      email: 'unauthorized@qub.ac.uk',
      password: await bcrypt.hash('password123', 10),
      forename: 'Tom',
      surname: 'Smith',
      active: 1,
      prefix: 'Mr',
      job_title: 'Visitor',
      role_id: 1, // Assuming no access to student data
    })

    const result = await authenticateUser(unauthorizedUser.email, 'password123')
    const unauthorizedToken = result.token

    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/courses`)
      .set('Authorization', `Bearer ${unauthorizedToken}`)

    expect(response.status).toBe(403)
    expect(response.body.error).toBe('Access denied: insufficient permissions {Role needed: 3 actual role id: 1}')

  })

  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/courses`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })

  it('should return 401 for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const response = await supertest(app)
      .get(`/api/students/${testStudent.id}/courses`)
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Token not found or invalid')
  })
})
