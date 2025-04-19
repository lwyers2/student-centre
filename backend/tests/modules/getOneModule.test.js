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
    const hashedPassword = await bcrypt.hash('superpass', 10)

    superUser = await User.create({
      email: 'super@qub.ac.uk',
      password: hashedPassword,
      forename: 'Sam',
      surname: 'Super',
      prefix: 'Mx',
      active: 1,
      role_id: 3, // Super User role
      job_title: 'System Admin'
    })

    const auth = await authenticateUser(superUser.email, 'superpass')
    token = auth.token

    module = await Module.create({
      title: 'Quantum Logic',
      code: 'QL404',
      year: 4,
      CATs: '40'
    })

    semester = await Semester.create({
      name: 'Semester 2'
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
    expect(res.body.module).toHaveProperty('title', 'Quantum Logic')
    expect(res.body.module_years[0]).toHaveProperty('year_start', 2024)
    expect(res.body.module_years[0].coordinator).toBe('Mx. Sam Super')
    expect(res.body.module_years[0].semester).toBe('Semester 2')
  })

  it('should return 404 if module is not found', async () => {
    const res = await supertest(app)
      .get('/api/modules/99999') // assuming this ID won't exist
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Module not found')
  })

  it('should block access for non-super users', async () => {
    // Create a normal academic user
    const normalUser = await User.create({
      email: 'not@ads.qub.ac.uk',
      password: await bcrypt.hash('nopepass', 10),
      forename: 'Nina',
      surname: 'Normal',
      prefix: 'Dr.',
      active: 1,
      role_id: 1, // Not Super User
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
