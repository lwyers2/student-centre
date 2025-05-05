const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')

const {
  User,
  Role,
  UserCourse,
  CourseYear,
  Course,
  QualificationLevel,
  AuthenticationUser,
} = require('../../models')

const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/users/course-year/:courseYear', () => {
  let token, adminUser, teacherUser, courseYear, superAdminUser

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create Roles
    const adminRole = await Role.create({ name: 'Admin' })
    const teacherRole = await Role.create({ name: 'Teacher' })

    // Create Users
    adminUser = await User.create({
      email: 'admin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      prefix: 'Dr',
      role_id: adminRole.id,
      active: 1,
      job_title: 'Office Administrator',
    })

    superAdminUser = await User.create({
      email: 'superadmin@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'User',
      prefix: 'Dr',
      role_id: 3,
      active: 1,
      job_title: 'Office Administrator',
    })

    teacherUser = await User.create({
      email: 'teacher@qub.ac.uk',
      password: hashedPassword,
      forename: 'Teacher',
      surname: 'User',
      prefix: 'Prof',
      role_id: teacherRole.id,
      active: 1,
      job_title: 'Lecturer',
    })

    // Authenticate (optional)
    const result = await authenticateUser(superAdminUser.email, 'password123')
    token = result.token

    // Qualification and Course setup (minimal)
    const qualification = await QualificationLevel.create({ qualification: 'BSc', level_id: 1 })
    const course = await Course.create({
      title: 'Computer Science',
      code: 'CS101',
      part_time: false,
      qualification_id: qualification.id,
      school_id: 1,
      years: 3,
    })

    courseYear = await CourseYear.create({
      year_start: 2023,
      year_end: 2024,
      course_id: course.id,
      course_coordinator: adminUser.id,
    })

    // Associate users to course year
    await UserCourse.create({ user_id: adminUser.id, course_year_id: courseYear.id, course_id: course.id })
    await UserCourse.create({ user_id: teacherUser.id, course_year_id: courseYear.id, course_id: course.id })
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: {} })
    await UserCourse.destroy({ where: {} })
    await CourseYear.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await QualificationLevel.destroy({ where: {} })
    await User.destroy({ where: {} })
    await Role.destroy({ where: {} })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return admin and teaching staff from the given course year', async () => {
    const res = await supertest(app)
      .get(`/api/users/course-year/${courseYear.id}`)
      .set('Authorization', `Bearer ${token}`)


    expect(res.status).toBe(200)


    expect(res.body).toHaveProperty('admin_staff')
    expect(res.body).toHaveProperty('teaching_staff')

    expect(res.body.admin_staff).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: adminUser.id, name: expect.stringContaining('Admin User') }),
      ])
    )

    expect(res.body.teaching_staff).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: teacherUser.id, name: expect.stringContaining('Teacher User') }),
      ])
    )
  })


  it('should return 401 if token is missing', async () => {
    const res = await supertest(app).get(`/api/users/course-year/${courseYear.id}`)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Missing or invalid token')
  })
})
