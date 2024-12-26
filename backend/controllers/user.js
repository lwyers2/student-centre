const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const Course = require('../models/course')
const Module = require('../models/module')
const School = require('../models/school')
const Role = require('../models/role')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.findAll({
      attributes: ['forename', 'surname', 'email', 'password', 'date_created', 'date_updated', 'active', 'token'],
      include: [
        {
          model: Course,
          attributes: ['title', 'years', 'code'],
          through: { attributes: [] },
        },
        {
          model: Module,
          attributes: ['title', 'semester', 'code'],
          through: { attributes: [] },
        },
        {
          model: School,
          attributes: ['school_name'],
          through: { attributes: [] },
        },
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        },
      ]
    })
    response.json(users)
  } catch (error) {
    console.error(error)
    response.status(500).json({
      error: 'failed to fetch users',
      details: error.message
    })
  }
})

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

usersRouter.get('/:user', async (request, response) => {
  try {
    const userId = request.params.user

    const userData = await User.findOne({
      where: { id: userId },
      attributes: [],
      include: [
        {
          model: Course,
          attributes: ['title', 'years', 'code' ],
          through: [ {} ],
        },
        {
          model: Module,
          attributes: ['title', 'semester', 'code'],
          through: [ {} ],
        },
      ],
    })

    if(!userData) {
      return response.status(404).json({ error: 'User not found' })
    }
    response.json(userData)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = usersRouter