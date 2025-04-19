const meetingService = require('../services/meeting')
const meetingRouter = require('express').Router()

meetingRouter.post('/create', async (req, res) => {
  const { studentId, moduleYearId, scheduledDate,  academicId, adminStaffId, meetingReason, courseYearId } = req.body

  const meeting = await meetingService.createMeeting(studentId, moduleYearId, scheduledDate,  academicId, adminStaffId, meetingReason, courseYearId)

  res.status(201).json({ success: true, message: 'Meeting created successfully', meeting })
})

meetingRouter.get(
  '/:meetingId',
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

meetingRouter.get(
  '/user/:userId',

  async (req, res, ) => {
    const userId = req.params.userId
    const meetings = await meetingService.getAllUserMeetings(userId)
    if (!meetings) {
      const error = new Error('No Meetings found')
      error.status = 404
      throw error
    }
    res.json(meetings)
  }
)

meetingRouter.put('/update/:meetingId', async (req, res) => {
  const { meetingId } = req.params
  const { outcome, scheduled_date, meeting_reason, academic_id, admin_staff_id } = req.body

  // Log the incoming data to debug
  console.log('Request Body:', req.body)

  try {
    const updatedMeeting = await meetingService.updateMeeting(meetingId, {
      outcome,
      scheduled_date,
      meeting_reason,
      academic_id,
      admin_staff_id,
    })

    return res.status(200).json({
      success: true,
      message: 'Meeting updated successfully',
      meeting: updatedMeeting,
    })
  } catch (error) {
    console.error('Error updating meeting:', error)
    return res.status(500).json({
      success: false,
      message: 'Error updating meeting',
    })
  }
})



// DELETE route to delete a meeting
meetingRouter.delete('/delete/:meetingId', async (req, res) => {
  const { meetingId } = req.params
  const result = await meetingService.deleteMeeting(meetingId)
  res.status(200).json(result)

})

meetingRouter.get('/student/:studentId', async (req, res) => {
  const studentId = req.params.studentId
  const meetings = await meetingService.getAllMeetingsForStudent(studentId)
  if (!meetings) {
    const error = new Error('No Meetings found')
    error.status = 404
    throw error
  }
  res.json(meetings)
}
)




module.exports = meetingRouter
