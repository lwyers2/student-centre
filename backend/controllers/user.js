const usersRouter = require('express').Router()
const userService = require('../services/user')
const tokenVerification = require('../middleware/tokenVerification')
const roleAuthorization = require('../middleware/roleAuthorization')
const roleAndIdAuthorization = require('../middleware/roleAndIdAuthorization')
const { validateId } = require('../validators/validateId')
const { validate } = require('../middleware/validate')

usersRouter.get('/',
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res) => {
    const users = await userService.getAllUsers()
    if(!users) {
      const error = new Error('Users not found')
      error.status = 404
      throw error
    }
    res.json(users)
  })

usersRouter.get(
  '/:user',
  validateId('user'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const userId = req.params.user
    const user = await userService.getUser(userId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)


usersRouter.get(
  '/:user/courses',
  validateId('user'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const userId = req.params.user
    const user = await userService.getUserCourses(userId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)

usersRouter.get(
  '/:user/modules/',
  validateId('user'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const userId = req.params.user
    const user = await userService.getUserModules(userId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)

usersRouter.get(
  '/:user/modules/:courseyear',
  validateId('user'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const userId = req.params.user
    const courseYearId = req.params.courseyear
    const user = await userService.getUserModulesFromCourseYear(userId, courseYearId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)

usersRouter.get(
  '/:user/module/:module',
  validateId('user'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const userId = req.params.user
    const moduleId = req.params.module
    const user = await userService.getUserModule(userId, moduleId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)

usersRouter.post(
  '/',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const newUser = await userService.createUser(req.body)
    res.status(201).json(newUser)
  }
)


//I don't think I'll use this
// usersRouter.get(
//   '/:user/students/:student',
//   validateId('user'),
//   async (req, res) => {
//     const userId = req.params.user
//     const studentId = req.params.student
//     console.log(studentId)
//     const user = await userService.getUserStudent(userId, studentId)
//     if(!user) {
//       const error = new Error('User not found')
//       error.status = 404
//       throw error
//     }
//     res.json(user)
//   }
// )

usersRouter.get(
  '/:user/students',
  async (req, res) => {
    const userId = req.params.user
    const user = await userService.getUserStudents(userId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)

module.exports = usersRouter