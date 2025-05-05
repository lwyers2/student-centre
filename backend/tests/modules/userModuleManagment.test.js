const supertest = require('supertest')
const app = require('../../app')
const bcrypt = require('bcrypt')
const {
  User,
  Module,
  ModuleYear,
  UserModule,
  AuthenticationUser,
  Semester,
} = require('../../models')
const { authenticateUser } = require('../../services/authenticateUser')

describe('POST & DELETE /api/modules (add/remove user from module)', () => {
  let superUser
  let moduleUser
  let token
  let module
  let moduleYear
  let semester

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create a Super User
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

    // Create a target user to assign to module
    moduleUser = await User.create({
      email: 'adminstaff@qub.ac.uk',
      password: hashedPassword,
      forename: 'Admin',
      surname: 'Staff',
      active: 1,
      role_id: 2,
      prefix: 'Mr',
      job_title: 'Administrator',
    })

    // Authenticate
    const result = await authenticateUser(superUser.email, 'password123')
    token = result.token
    await AuthenticationUser.findOne({ where: { token } })

    // Create semester if not already seeded
    semester = await Semester.create({ name: 'Semester 1' })

    // Create module & module year
    module = await Module.create({
      title: 'Distributed Systems',
      code: 'CS3050',
      CATs: 20,
      year: 3
    })

    moduleYear = await ModuleYear.create({
      module_id: module.id,
      year_start: 2023,
      semester_id: semester.id,
      module_coordinator_id: superUser.id
    })
  })

  afterAll(async () => {
    await AuthenticationUser.destroy({ where: {} })
    await UserModule.destroy({ where: {} })
    await ModuleYear.destroy({ where: {} })
    await Module.destroy({ where: {} })
    await Semester.destroy({ where: {} })
    await User.destroy({ where: {}, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  // ✅ Add user to module
  it('should add user to a module year', async () => {
    const response = await supertest(app)
      .post('/api/modules/add-user-to-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: moduleUser.id,
        moduleId: module.id,
        moduleYearId: moduleYear.id
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('module_id', module.id)
    expect(response.body).toHaveProperty('title', 'Distributed Systems')

    const check = await UserModule.findOne({
      where: {
        user_id: moduleUser.id,
        module_year_id: moduleYear.id,
        module_id: module.id
      }
    })
    expect(check).not.toBeNull()
  })

  // 🚫 Adding user again should fail
  it('should return 400 if user is already in module year', async () => {
    const response = await supertest(app)
      .post('/api/modules/add-user-to-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: moduleUser.id,
        moduleId: module.id,
        moduleYearId: moduleYear.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User already in module year')
  })

  // 🚫 Missing fields
  it('should return 400 if required fields are missing on add', async () => {
    const response = await supertest(app)
      .post('/api/modules/add-user-to-module')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: moduleUser.id })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  // ✅ Remove user from module
  it('should remove the user from the module year', async () => {
    const response = await supertest(app)
      .delete('/api/modules/remove-user-from-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: moduleUser.id,
        moduleId: module.id,
        moduleYearId: moduleYear.id
      })

    expect(response.status).toBe(200)

    const check = await UserModule.findOne({
      where: {
        user_id: moduleUser.id,
        module_year_id: moduleYear.id,
        module_id: module.id
      }
    })
    expect(check).toBeNull()
  })

  // 🚫 Try to remove again
  it('should return 400 if the user is not in the module year', async () => {
    const response = await supertest(app)
      .delete('/api/modules/remove-user-from-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: moduleUser.id,
        moduleId: module.id,
        moduleYearId: moduleYear.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User not in module year')
  })

  // 🚫 User not found
  it('should return 404 if user does not exist', async () => {
    const response = await supertest(app)
      .delete('/api/modules/remove-user-from-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 999999,
        moduleId: module.id,
        moduleYearId: moduleYear.id
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('User not found')
  })

  // 🚫 Module year not found
  it('should return 404 if module year does not exist', async () => {
    const response = await supertest(app)
      .delete('/api/modules/remove-user-from-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: moduleUser.id,
        moduleId: module.id,
        moduleYearId: 999999
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Module year not found')
  })

  // 🚫 Missing fields
  it('should return 400 if required fields are missing on delete', async () => {
    const response = await supertest(app)
      .delete('/api/modules/remove-user-from-module')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: moduleUser.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields')
  })

  // 🚫 Missing token
  it('should return 401 if no token is provided', async () => {
    const response = await supertest(app)
      .delete('/api/modules/remove-user-from-module')
      .send({
        userId: moduleUser.id,
        moduleId: module.id,
        moduleYearId: moduleYear.id
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Missing or invalid token')
  })
})
