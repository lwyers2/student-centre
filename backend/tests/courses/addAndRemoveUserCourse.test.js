const supertest = require('supertest')
const app = require('../../app')
const bcrypt = require('bcrypt')
const {
  User,
  Course,
  CourseYear,
  UserCourse,
  School,
  QualificationLevel,
  AuthenticationUser
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('POST & DELETE /api/courses (assign/remove user from course)', () => {
  let superUser
  let targetUser
  let token
  let course
  let courseYear

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    superUser = await User.create({
      email: 'super@qub.ac.uk',
      password: hashedPassword,
      forename: 'Super',
      surname: 'User',
      active: 1,
      role_id: 3,
      prefix: 'Dr',
      job_title: 'Professor',
    })

    targetUser = await User.create({
      email: 'admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      active: 1,
      role_id: 2,
      prefix: 'Ms',
      job_title: 'Administrator',
    })

    const result = await authenticateUser(superUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })

    const school = await School.create({ school_name: 'Engineering' })

    const qualification = await QualificationLevel.create({
      qualification: 'BSc',
      level_id: 1
    })

    course = await Course.create({
      title: 'Computer Science',
      years: 3,
      school_id: school.id,
      code: 'CS1000',
      part_time: false,
      qualification_id: qualification.id
    })

    courseYear = await CourseYear.create({
      course_id: course.id,
      year_start: 2023,
      year_end: 2024,
      course_coordinator: superUser.id
    })
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: {} })
    await UserCourse.destroy({ where: {} })
    await CourseYear.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await QualificationLevel.destroy({ where: {} })
    await School.destroy({ where: {} })
    await User.destroy({ where: {}, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  // ✅ Assign course year to user
  it('should assign a course year to a user', async () => {
    const response = await supertest(app)
      .post('/api/courses/assign-course-year-to-user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id,
        courseId: course.id,
        courseYearId: courseYear.id
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', courseYear.id)

    const record = await UserCourse.findOne({
      where: {
        user_id: targetUser.id,
        course_id: course.id,
        course_year_id: courseYear.id
      }
    })
    expect(record).not.toBeNull()
  })

  // 🚫 Duplicate assignment
  it('should return 400 if user is already in the course year', async () => {
    const response = await supertest(app)
      .post('/api/courses/assign-course-year-to-user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id,
        courseId: course.id,
        courseYearId: courseYear.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User already in course year')
  })

  // 🚫 Missing fields on assign
  it('should return 400 if required fields are missing on assign', async () => {
    const response = await supertest(app)
      .post('/api/courses/assign-course-year-to-user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  // 🚫 Assign with invalid user
  it('should return 404 if user does not exist on assign', async () => {
    const response = await supertest(app)
      .post('/api/courses/assign-course-year-to-user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 99999,
        courseId: course.id,
        courseYearId: courseYear.id
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('User not found')
  })

  // ✅ Remove user from course year
  it('should remove the user from the course year', async () => {
    const response = await supertest(app)
      .delete('/api/courses/remove-user-from-course')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id,
        courseId: course.id,
        courseYearId: courseYear.id
      })

    expect(response.status).toBe(200)

    const record = await UserCourse.findOne({
      where: {
        user_id: targetUser.id,
        course_id: course.id,
        course_year_id: courseYear.id
      }
    })

    expect(record).toBeNull()
  })

  // 🚫 Remove user not in course year
  it('should return 400 if user is not in the course year', async () => {
    const response = await supertest(app)
      .delete('/api/courses/remove-user-from-course')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id,
        courseId: course.id,
        courseYearId: courseYear.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User not in courseYears')
  })

  // 🚫 Remove with missing fields
  it('should return 400 if required fields are missing on remove', async () => {
    const response = await supertest(app)
      .delete('/api/courses/remove-user-from-course')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  // 🚫 Remove with invalid user
  it('should return 404 if user does not exist on remove', async () => {
    const response = await supertest(app)
      .delete('/api/courses/remove-user-from-course')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 99999,
        courseId: course.id,
        courseYearId: courseYear.id
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('User not found')
  })

  // 🚫 Remove with invalid courseYear
  it('should return 404 if course year does not exist on remove', async () => {
    const response = await supertest(app)
      .delete('/api/courses/remove-user-from-course')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: targetUser.id,
        courseId: course.id,
        courseYearId: 999999
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Course year not found')
  })
})
