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
    if(!courses || courses.length === 0) {
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
  '/schools/:schoolId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const schoolId = req.params.schoolId
    const courses = await courseService.getCoursesFromSchool(schoolId)
    if(!courses || courses.length === 0) {
      const error = new Error('Courses not found')
      error.status = 404
      throw error
    }
    res.json(courses)
  }
)

coursesRouter.put('/update-course-year/course/:courseId/course-year/:courseYearId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const { courseId, courseYearId } = req.params  // Correct the destructuring
    const { course_coordinator } = req.body  // Assuming you are sending the coordinator ID

    // Call the service to update the course year
    const updatedCourseYear = await courseService.updateCourseYear(courseId, courseYearId, course_coordinator)

    // Check if the course year was found and updated
    if (!updatedCourseYear) {
      const error = new Error('Course Year not found')
      error.status = 404
      throw error
    }

    // Return the updated course year
    res.json(updatedCourseYear)
  }
)

coursesRouter.post('/add-course-year/course/:courseId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const { courseId } = req.params
    const { yearStart, courseYears, courseCoordinatorId } = req.body

    if (!yearStart || !courseYears) {
      const error = new Error('Missing required fields: yearStart or courseYears')
      error.status = 400
      throw error
    }

    const newCourseYear = await courseService.addCourseYear(courseId, yearStart, courseYears, courseCoordinatorId)

    if (!newCourseYear) {
      const error = new Error('Course not found')
      error.status = 404
      throw error
    }

    res.status(201).json(newCourseYear)
  }
)

coursesRouter.put(
  '/edit-course/:courseId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const courseId = req.params.courseId
    const { title, code, qualification, part_time } = req.body

    if (!title || !code || !qualification) {
      const error = new Error('Missing required fields: title, code or qualification')
      error.status = 400
      throw error
    }

    const updatedCourse = await courseService.updateCourse(courseId, { title, code, qualification, part_time })

    if (!updatedCourse) {
      const error = new Error('Course not found')
      error.status = 404
      throw error
    }

    res.json(updatedCourse)
  }
)




module.exports = coursesRouter