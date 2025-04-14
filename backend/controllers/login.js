const loginRouter = require('express').Router()
const { authenticateUser } = require('../services/authenticateUser')
const { validateLogin } = require('../validators/validateLogin')
const { rateLimitLoginAttempts } = require('../middleware/rateLimitLoginAttempts')

loginRouter.post(
  '/',
  rateLimitLoginAttempts,
  validateLogin,
  async (req, res) => {
    const { email, password } = req.body
    const { token, user, accessibleModuleYears, accessableCourseYears, accessibleCourses, accessibleModules } = await authenticateUser(email, password)

    res.status(200).json({
      token,
      email: user.email,
      forename: user.forename,
      surname: user.surname,
      id: user.id,
      prefix: user.prefix,
      role: user.role_id,
      accessible_module_years: accessibleModuleYears,
      accessible_course_years: accessableCourseYears,
      accessible_courses: accessibleCourses,
      accessible_modules: accessibleModules,
    })
  })

module.exports = loginRouter
