const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../../app') // adjust if your app is located elsewhere
const { User } = require('../../models')
const nodemailer = require('nodemailer')

// Mock nodemailer
jest.mock('nodemailer')
const sendMailMock = jest.fn()
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

console.log('sendMailMock called with:', sendMailMock.mock.calls)


describe('POST /api/reset-password', () => {
  let user

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('originalPassword123', 10)
    user = await User.create({
      email: 'resetme@qub.ac.uk',
      password: hashedPassword,
      forename: 'Testy',
      surname: 'McTestface',
      prefix: 'Mx',
      active: 1,
      role_id: 1,
      job_title: 'Tester',
    })
  })

  afterAll(async () => {
    await User.destroy({ where: { id: user.id }, force: true })
  })

  it('should reset password and send an email', async () => {
    sendMailMock.mockClear()
    sendMailMock.mockImplementation((opts, cb) => cb(null)) // Simulate success

    const res = await supertest(app)
      .post('/api/reset-password')
      .send({ email: user.email })

    expect(res.status).toBe(200)
    expect(res.text).toMatch(/Password reset email sent/)

    // Verify email was "sent"
    expect(sendMailMock).toHaveBeenCalledTimes(1)
    const emailText = sendMailMock.mock.calls[0][0].text
    expect(emailText).toMatch(/Your new password is:/)

    // Verify that user's password was actually changed
    const updatedUser = await User.findOne({ where: { email: user.email } })
    const newPasswordInEmail = emailText.split(': ')[1].trim()
    const matchesOld = await bcrypt.compare('originalPassword123', updatedUser.password)
    const matchesNew = await bcrypt.compare(newPasswordInEmail, updatedUser.password)

    expect(matchesOld).toBe(false)
    expect(matchesNew).toBe(true)
  })

  it('should return 400 for non-existent user', async () => {
    const res = await supertest(app)
      .post('/api/reset-password')
      .send({ email: 'nosuchuser@qub.ac.uk' })

    expect(res.status).toBe(400)
    expect(res.text).toBe('User not found')
  })

  it('should return 500 on mail send failure', async () => {
    sendMailMock.mockImplementationOnce((_opts, cb) => cb(new Error('SMTP failed')))

    const res = await supertest(app)
      .post('/api/reset-password')
      .send({ email: user.email })

    expect(res.status).toBe(500)
    expect(res.text).toMatch(/Error sending email: SMTP failed/)
  })
})
