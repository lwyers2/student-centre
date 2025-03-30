const meetingService = require('../services/meeting')
const meetingRouter = require('express').Router()

meetingRouter.post('/create', async (req, res) => {
  const { studentId, moduleYearId, scheduledDate,  academicId, adminStaffId, meetingReason, courseYearId } = req.body

  const meeting = await meetingService.createMeeting(studentId, moduleYearId, scheduledDate,  academicId, adminStaffId, meetingReason, courseYearId)

  res.status(201).json({ success: true, message: 'Meeting created successfully', meeting })
})

meetingRouter.get(
  '/:meetingId',
  // validateId('meeting'),
  //   validate,
  //   tokenVerification,
  //   roleAuthorization(['Super User', 'Admin', 'Teacher']),
  async (req, res, ) => {
    const meetingId = req.params.meetingId
    const meeting = await meetingService.getOneMeeting(meetingId)
    if (!meeting) {
      const error = new Error('Meeting not found')
      error.status = 404
      throw error
    }
    res.json(meeting)
  }

)



module.exports = meetingRouter
