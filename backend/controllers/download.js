const fileDownloadRouter = require('express').Router()
const path = require('path')
const fs = require('fs')
const { Meeting } = require('../models')  // Assuming Meeting model is in '../models'
const tokenVerification = require('../middleware/tokenVerification')

/**
 * Route for downloading the meeting minutes file
 * Takes 'meetingId' as a parameter
 */
fileDownloadRouter.get(
  '/meeting-minutes/:meetingId',
  tokenVerification,
  async (req, res) => {
    try {
    // Retrieve the meetingId from the route parameters
      const meetingId = req.params.meetingId

      // Fetch the meeting from the database
      const meeting = await Meeting.findByPk(meetingId)

      // Check if the meeting exists and has a file path
      if (!meeting || !meeting.path_to_minutes) {
        return res.status(404).json({ success: false, message: 'Meeting minutes not found' })
      }

      const filePath = meeting.path_to_minutes  // This should be something like /uploads/1742743325247.docx

      // Construct the absolute file path
      const absoluteFilePath = path.join(__dirname, '..', filePath)

      // Check if the file exists on the server before attempting to send it
      fs.stat(absoluteFilePath, (err, stats) => {
        if (err || !stats.isFile()) {
          return res.status(404).json({ success: false, message: 'File not found on the server' })
        }

        // Set the headers to prompt the browser to download the file
        res.setHeader('Content-Disposition', `attachment filename=${path.basename(absoluteFilePath)}`)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') // DOCX MIME type

        // Send the file for download
        res.sendFile(absoluteFilePath, (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error downloading file', error: err.message })
          }
        })
      })

    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving meeting minutes', error: error.message })
    }
  })

module.exports = fileDownloadRouter
