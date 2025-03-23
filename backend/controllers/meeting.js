const { createMeeting } = require('../services/meeting')
const meetingRouter = require('express').Router()

meetingRouter.post('/create', async (req, res) => {
  const { studentId, moduleYearId, scheduledDate,  academicId, adminStaffId, meetingReason } = req.body

  const meeting = await createMeeting(studentId, moduleYearId, scheduledDate,  academicId, adminStaffId, meetingReason)

  res.status(201).json({ success: true, message: 'Meeting created successfully', meeting })
})

module.exports = meetingRouter
