const supertest = require('supertest')
const path = require('path')
const fs = require('fs')
const app = require('../../app') // adjust path if needed
const { Meeting } = require('../../models')

describe('POST /upload/meeting-minutes', () => {
  let testMeeting
  let uploadedFilePath = ''

  beforeAll(async () => {
    // Create dummy meeting
    testMeeting = await Meeting.create({
      title: 'Test Meeting',
      meeting_date: new Date(),
      path_to_minutes: null,
    })

    // Ensure upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  })

  afterAll(async () => {
    // Cleanup DB entry
    if (testMeeting) {
      await Meeting.destroy({ where: { id: testMeeting.id }, force: true })
    }

    // Delete uploaded file if exists
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath)
    }
  })

  it('should upload a meeting minutes file and update meeting record', async () => {
    const res = await supertest(app)
      .post('/upload/meeting-minutes')
      .field('meetingId', testMeeting.id.toString())
      .attach('file', path.join(__dirname, '../fixtures/minutes_sample.docx'))

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.filePath).toContain('/uploads/')
    expect(res.body.meeting.id).toBe(testMeeting.id)

    // Save path for cleanup
    uploadedFilePath = path.join(__dirname, '../../', res.body.filePath)
  })

  it('should return 404 if meeting not found', async () => {
    const res = await supertest(app)
      .post('/upload/meeting-minutes')
      .field('meetingId', '999999') // non-existent meeting
      .attach('file', path.join(__dirname, '../fixtures/minutes_sample.docx'))

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Meeting not found')
  })

  it('should return 400 if no file is uploaded', async () => {
    const res = await supertest(app)
      .post('/upload/meeting-minutes')
      .field('meetingId', testMeeting.id.toString())

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('No file uploaded')
  })
})
