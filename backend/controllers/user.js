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


usersRouter.get(
  '/course-year/:courseYear',
  async (req, res) => {
    const courseYearId = req.params.courseYear
    const users = await userService.getUsersFromCourseYear(courseYearId)
    if(!users) {
      const error = new Error('No users found')
      error.status = 404
      throw error
    }
    res.json(users)
  }
)

usersRouter.get(
  '/school/:schoolId',
  async (req, res) => {
    const schoolId = req.params.schoolId
    const users = await userService.getUsersFromSchool(schoolId)
    if(!users) {
      const error = new Error('No users found')
      error.status = 404
      throw error
    }
    res.json(users)
  }
)

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

usersRouter.get(
  '/module/:moduleId',
  validateId('moduleId'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const moduleId = req.params.moduleId
    const users = await userService.getUsersFromModule(moduleId)
    if(!users) {
      const error = new Error('No users found')
      error.status = 404
      throw error
    }
    res.json(users)
  }
)

module.exports = usersRouter