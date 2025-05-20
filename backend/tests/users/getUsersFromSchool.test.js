const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')

const {
  User,
  Role,
  UserSchool,
  School,
  AuthenticationUser,
} = require('../../models')

const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/users/school/:schoolId', () => {
  let token, adminUser, teacherUser, school

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    const adminRole = await Role.create({ name: 'Admin' })
    const teacherRole = await Role.create({ name: 'Teacher' })

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

    const result = await authenticateUser(adminUser.email, 'password123')
    token = result.token

    school = await School.create({ school_name: 'Engineering & CS' })

    await UserSchool.create({ user_id: adminUser.id, school_id: school.id })
    await UserSchool.create({ user_id: teacherUser.id, school_id: school.id })
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: {} })
    await UserSchool.destroy({ where: {} })
    await School.destroy({ where: {} })
    await User.destroy({ where: {} })
    await Role.destroy({ where: {} })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return admin and teaching staff for a given school', async () => {
    const res = await supertest(app)
      .get(`/api/users/school/${school.id}`)
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


})
