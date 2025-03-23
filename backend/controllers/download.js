const fileDownloadRouter = require('express').Router()
const path = require('path')
const { Meeting } = require('../models')  // Assuming Meeting model is in '../models'


/**
 * Route for downloading the meeting minutes file
 * Takes 'meetingId' as a parameter
 */
fileDownloadRouter.get('/meeting-minutes/:meetingId', async (req, res) => {
  try {
    // Retrieve the meetingId from the route parameters
    const meetingId = req.params.meetingId

    // Fetch the meeting from the database
    const meeting = await Meeting.findByPk(meetingId)

    // Check if the meeting exists and has a file path
    if (!meeting || !meeting.path_to_minutes) {
      return res.status(404).json({ success: false, message: 'Meeting minutes not found' })
    }

    const filePath = meeting.path_to_minutes

    // Serve the file for download
    res.download(filePath, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error downloading file', error: err.message })
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving meeting minutes', error: error.message })
  }
})

module.exports = fileDownloadRouter
