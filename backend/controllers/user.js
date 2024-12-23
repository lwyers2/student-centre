const usersRouter = require('express').Router()
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

module.exports = usersRouter