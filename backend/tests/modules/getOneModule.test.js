const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../app')

const {
  User,
  Module,
  ModuleYear,
  Semester,
  AuthenticationUser
} = require('../../models')

const { authenticateUser } = require('../../services/authenticateUser')

describe('GET /api/modules/:moduleId', () => {
  let superUser, token, module,  semester

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password', 10)

    superUser = await User.create({
      email: 'super@qub.ac.uk',
      password: hashedPassword,
      forename: 'User',
      surname: 'Super',
      prefix: 'Mr',
      active: 1,
      role_id: 3,
      job_title: 'Site Administrator'
    })

    const auth = await authenticateUser(superUser.email, 'password')
    token = auth.token

    module = await Module.create({
      title: 'Quantum Computing',
      code: 'QC404',
      year: 4,
      CATs: '40'
    })

    semester = await Semester.create({
      name: 'Winter'
    })

    await ModuleYear.create({
      year_start: 2024,
      semester_id: semester.id,
      module_id: module.id,
      module_coordinator_id: superUser.id
    })
  })

  afterAll(async () => {
    await ModuleYear.destroy({ where: {} })
    await Module.destroy({ where: {} })
    await Semester.destroy({ where: {} })
    await AuthenticationUser.destroy({ where: { user_id: superUser.id } })
    await User.destroy({ where: { id: superUser.id }, force: true })
  })

  beforeEach(async () => {
    await AuthenticationUser.update(
      { expires_at: new Date(Date.now() + 3600 * 1000), is_active: true },
      { where: { token } }
    )
  })

  it('should return the module with coordinator and semester', async () => {
    const res = await supertest(app)
      .get(`/api/modules/${module.id}`)
      .set('Authorization', `Bearer ${token}`)


    expect(res.status).toBe(200)
    expect(res.body.module).toHaveProperty('id', module.id)
    expect(res.body.module).toHaveProperty('title', 'Quantum Computing')
    expect(res.body.module_years[0]).toHaveProperty('year_start', 2024)
    expect(res.body.module_years[0].coordinator).toBe('Mr. User Super')
    expect(res.body.module_years[0].semester).toBe('Winter')
  })

  it('should return 404 if module is not found', async () => {
    const res = await supertest(app)
      .get('/api/modules/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Module not found')
  })

  it('should block access for non-super users', async () => {
    const normalUser = await User.create({
      email: 'user@ads.qub.ac.uk',
      password: await bcrypt.hash('nopepass', 10),
      forename: 'User',
      surname: 'Teacher',
      prefix: 'Dr.',
      active: 1,
      role_id: 1,
      job_title: 'Lecturer'
    })

    const auth = await authenticateUser(normalUser.email, 'nopepass')
    const badToken = auth.token

    const res = await supertest(app)
      .get(`/api/modules/${module.id}`)
      .set('Authorization', `Bearer ${badToken}`)

    expect(res.status).toBe(403)

    await AuthenticationUser.destroy({ where: { user_id: normalUser.id } })
    await User.destroy({ where: { id: normalUser.id }, force: true })
  })
})
