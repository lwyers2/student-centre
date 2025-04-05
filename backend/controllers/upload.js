const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadRouter = require('express').Router()
const { processStudentCSV } = require('../services/upload')
const { Meeting, } = require('../models')
const { validateCSVs } = require('../validators/validateCSVs')

const studentRequiredFields = ['forename', 'surname', 'email', 'student_code', 'course_title', 'course_year_start']


// 1. Configure Multer Storage for All Upload Types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/'
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Save with timestamp
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = /docx|doc|csv/ // Allow .docx, .doc, .csv files
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)

    if (extname && mimeType) {
      return cb(null, true)
    } else {
      cb(new Error('Only .docx, .doc, .csv files are allowed.'))
    }
  }
})

/**
 * 1. Route for Uploading Meeting Minutes (.docx, .doc)
 */
uploadRouter.post('/meeting-minutes', upload.single('file'), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const filePath = '/uploads/' + req.file.filename // Make path relative
    const meetingId = req.body.meetingId

    const meeting = await Meeting.findByPk(meetingId)
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' })
    }

    // Check if the meeting already has meeting minutes
    if (meeting.path_to_minutes) {
      // File exists, delete the old file
      const oldFilePath = path.join(__dirname, '..', meeting.path_to_minutes)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath) // Delete the old file
      }
    }

    // Save the new file path in the meeting record
    meeting.path_to_minutes = filePath
    await meeting.save()

    res.status(200).json({
      success: true,
      message: 'Meeting minutes uploaded successfully',
      filePath: filePath,
      meeting: meeting
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading file', error: error.message })
  }
})

// /**
//  * 2. Route for Uploading Course Results (CSV)
//  */
// uploadRouter.post('/results/course-year', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' })
//     }

//     const courseYearId = req.body.courseYearId
//     const courseYear = await CourseYear.findByPk(courseYearId)
//     if (!courseYear) {
//       return res.status(404).json({ success: false, message: 'Course year not found' })
//     }

//     // Process CSV file temporarily in memory
//     const fileData = req.file.buffer // The file content is stored in memory
//     // Add logic for parsing CSV (not implemented yet)

//     res.status(200).json({
//       success: true,
//       message: 'Course results CSV uploaded and processed successfully',
//       fileSize: req.file.size,
//       courseYearId: courseYearId
//     })
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error uploading file', error: error.message })
//   }
// })

// /**
//  * 3. Route for Uploading Student Data (CSV)
//  */
uploadRouter.post('/students',
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const filePath = req.file.path

    // Validate CSV before processing it
    await validateCSVs(filePath, studentRequiredFields)

    // If validation passes, process the CSV
    const { students, stats } = await processStudentCSV(filePath)

    res.status(200).json({
      success: true,
      message: 'CSV uploaded and processed successfully',
      totalRecords: students.length,
      stats // includes studentsAdded, studentCourseLinks, studentModuleAssignments
    })
  }
)








module.exports = uploadRouter
