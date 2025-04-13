const coursesRouter = require('express').Router()
const courseService = require('../services/course')
const tokenVerification = require('../middleware/tokenVerification')
const roleAndIdAuthorization = require('../middleware/roleAndIdAuthorization')
const { validate } = require('../middleware/validate')



coursesRouter.get(
  '/',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {

    const courses = await courseService.getAllCourses()
    if(!courses) {
      const error = new Error('Courses not found')
      error.status = 404
      throw error
    }
    res.json(courses)
  })

coursesRouter.get(
  '/:courseId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const courseId = req.params.courseId
    const course = await courseService.getOneCourse(courseId)
    if(!course) {
      const error = new Error('Course not found')
      error.status = 404
      throw error
    }
    res.json(course)
  }
)

coursesRouter.get(
  ':schoolId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const schoolId = req.params.schoolId
    const courses = await courseService.getCoursesFromSchool(schoolId)
    if(!courses) {
      const error = new Error('Courses not found')
      error.status = 404
      throw error
    }
    res.json(courses)
  }
)


module.exports = coursesRouter