const studentsRouter = require('express').Router()
const studentService = require('../services/student')
const { validateId } = require('../validators/validateId')
const validate = require('../middleware/validate')
const tokenVerification = require('../middleware/tokenVerification')
const roleAuthorization = require('../middleware/roleAuthorization')


studentsRouter.get('/',
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res, ) => {

    const students = await studentService.getAllStudents()
    if (!students) {
      const error = new Error('Students not found')
      error.status = 404
      throw error
    }
    res.json(students)
  })


studentsRouter.get(
  '/:student',
  validateId('student'),
  validate,
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res, ) => {
    const studentId = req.params.student
    const student = await studentService.getAllStudentData(studentId)
    if (!student) {
      const error = new Error('Student not found')
      error.status = 404
      throw error
    }
    res.json(student)
  }
)


studentsRouter.get(
  '/:student/courses',
  validateId('student'),
  validate,
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res, ) => {
    const studentId = req.params.student
    const student = await studentService.getStudentCoursesData(studentId)
    if (!student) {
      const error = new Error('Student not found')
      error.status = 404
      throw error
    }
    //could set next explicity, but no need to as using express-async errors
    // if (!student) {
    //   const error = new Error('Student not found')
    //   error.status = 404
    //   return _next(error) //
    // }
    res.json(student)
  }
)

studentsRouter.get(
  '/:student/modules',
  validateId('student'),
  validate,
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res,) => {
    const studentId = req.params.student
    const student = await studentService.getStudentModulesData(studentId)
    if (!student) {
      const error = new Error('Student not found')
      error.status = 404
      throw error
    }
    res.json(student)
  }
)

studentsRouter.get(
  '/:student/module-year/:moduleYearId',
  async (req, res) => {
    const studentId = req.params.student
    const moduleYearId = req.params.moduleYearId
    const student = await studentService.getStudentModuleData(studentId, moduleYearId)
    if (!student) {
      const error = new Error('Student not found')
      error.status = 404
      throw error
    }
    res.json(student)
  }
)


module.exports = studentsRouter