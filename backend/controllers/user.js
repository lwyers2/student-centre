const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const userService = require('../services/user')
const tokenVerification = require('../middleware/tokenVerification')
const roleAuthorization = require('../middleware/roleAuthorization')
const roleAndIdAuthorization = require('../middleware/roleAndIdAuthorization')
const { validateId } = require('../validators/validateId')
const { validate } = require('../middleware/validate')
const User = require('../models/user')
const Role = require('../models/role')

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
  '/:user/students/:student',
  validateId('user'),
  async (req, res) => {
    const userId = req.params.user
    const studentId = req.params.student
    console.log(studentId)
    const user = await userService.getUserStudent(userId, studentId)
    if(!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    res.json(user)
  }
)

usersRouter.post('/', async (request, response) => {
  const { forename, surname, email, password, active, token, roleName } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  if (!forename || !surname || !email || !password || !roleName) {
    return response.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Find the role by name
    const role = await Role.findOne({ where: { name: roleName } })
    console.log(`${role.id}: role, ${roleName}: rolename`)
    if (!role) {
      return response.status(404).json({ error: 'Role not found' })
    }

    // Create the new user with role_id
    const now = new Date()
    const newUser = await User.create({
      forename,
      surname,
      email,
      password: passwordHash,
      date_created: now,
      date_updated: now,
      active: active ?? true,
      token,
      role_id: role.id // Explicitly set the role_id
    })

    response.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    response.status(500).json({
      error: 'Failed to create user',
      details: error.message
    })
  }
})





module.exports = usersRouter