const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadRouter = require('express').Router()
const { processStudentCSV } = require('../services/upload')
const { Meeting } = require('../models')
const { validateCSVs } = require('../validators/validateCSVs')
const { uploadResults } = require('../services/uploadResults')

const studentRequiredFields = ['forename', 'surname', 'email', 'student_code', 'course_title', 'course_year_start']
const resultsRequiredFields = ['student_code', 'module_code', 'module_year_start', 'module_year', 'result', 'result_descriptor']

// 🔧 Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/'
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /docx|doc|csv/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)
    if (extname && mimeType) {
      cb(null, true)
    } else {
      cb(new Error('Only .docx, .doc, .csv files are allowed.'))
    }
  }
})

// 📎 Utility to get file path
const getFilePath = (req) => req.file?.path

// 📝 Upload Meeting Minutes
uploadRouter.post('/meeting-minutes', upload.single('file'), async (req, res) => {
  const filePath = '/uploads/' + req.file.filename
  const meetingId = req.body.meetingId

  const meeting = await Meeting.findByPk(meetingId)
  if (!meeting) {
    return res.status(404).json({ success: false, message: 'Meeting not found' })
  }

  if (meeting.path_to_minutes) {
    const oldFilePath = path.join(__dirname, '..', meeting.path_to_minutes)
    if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath)
  }

  meeting.path_to_minutes = filePath
  await meeting.save()

  res.status(200).json({
    success: true,
    message: 'Meeting minutes uploaded successfully',
    filePath,
    meeting
  })
})

// 🧾 Upload Student CSV
uploadRouter.post('/students', upload.single('file'), async (req, res) => {
  const filePath = getFilePath(req)
  if (!filePath) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  await validateCSVs(filePath, studentRequiredFields)

  const result = await processStudentCSV(filePath)

  if (!result?.stats) {
    return res.status(500).json({
      success: false,
      message: 'Unexpected error processing CSV data',
      error: 'Missing or malformed stats',
    })
  }

  const { studentsAdded, studentCourseLinks, studentModuleAssignments } = result.stats

  res.status(200).json({
    success: true,
    message: 'CSV uploaded and processed successfully',
    totalRecords: studentsAdded,
    stats: {
      studentsAdded,
      studentCourseLinks,
      studentModuleAssignments,
    }
  })
})

// 📊 Upload Course Year Results
uploadRouter.post('/results/:courseYearId', upload.single('file'), async (req, res) => {
  const filePath = getFilePath(req)
  if (!filePath) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  await validateCSVs(filePath, resultsRequiredFields)

  const result = await uploadResults(req.params.courseYearId, filePath)

  res.status(200).json({
    success: true,
    message: 'Course year results processed successfully',
    stats: result
  })
})



module.exports = uploadRouter
