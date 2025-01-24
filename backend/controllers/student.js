const studentsRouter = require('express').Router()
const studentService = require('../services/student')
const { param } = require('express-validator')


studentsRouter.get('/', async (req, res, _next) => {

  const students = await studentService.getAllStudents()
  if(!students) return res.status(404).json({ error: 'No students found' })
  res.json(students)
})


studentsRouter.get(
  '/:student',
  param('student').isUUID().withMessage('Invalid student ID format'), //Ensures the student id is a uuid
  async (req, res, _next) => {
    const studentId = req.params.student
    const student = await studentService.getAllStudentData(studentId)
    if (!student) return res.status(404).json({ error: 'Student not found' })
    res.json(student)
  }
)


studentsRouter.get(
  '/:student/courses',
  param('student').isUUID().withMessage('Invalid student ID format'), //Ensures the student id is a uuid
  async (req, res, _next) => {
    const studentId = req.params.student
    const student = await studentService.getStudentCoursesData(studentId)
    if (!student) return res.status(404).json({ error: 'Student not found' })
    res.json(student)
  }
)

studentsRouter.get(
  '/:student/modules',
  param('student').isUUID().withMessage('Invalid student ID format'), //Ensures the student id is a uuid
  async (req, res, _next) => {
    const studentId = req.params.student
    const student = await studentService.getStudentModulesData(studentId)
    if (!student) return res.status(404).json({ error: 'Student not found' })
    res.json(student)
  }
)


module.exports = studentsRouter