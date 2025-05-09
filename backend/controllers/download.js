const fileDownloadRouter = require('express').Router()
const path = require('path')
const fs = require('fs')
const { Meeting } = require('../models')
const tokenVerification = require('../middleware/tokenVerification')

fileDownloadRouter.get(
  '/meeting-minutes/:meetingId',
  tokenVerification,
  async (req, res) => {
    try {
      const meetingId = req.params.meetingId

      const meeting = await Meeting.findByPk(meetingId)

      if (!meeting || !meeting.path_to_minutes) {
        return res.status(404).json({ success: false, message: 'Meeting minutes not found' })
      }

      const filePath = meeting.path_to_minutes

      // Make the file path
      const absoluteFilePath = path.join(__dirname, '..', filePath)

      // Find if the file is already there
      fs.stat(absoluteFilePath, (err, stats) => {
        if (err || !stats.isFile()) {
          return res.status(404).json({ success: false, message: 'File not found on the server' })
        }

        // Headers for browser - content-disposition = attachment type, content type is mime type
        res.setHeader('Content-Disposition', `attachment filename=${path.basename(absoluteFilePath)}`)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

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
