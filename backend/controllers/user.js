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
      attributes: ['id', 'forename', 'surname', 'email', 'active', 'date_created', 'date_updated'],
      include: [
        {
          model: Course,
          attributes: ['id', 'title', 'years', 'code'],
          include: [
            {
              model: Module,
              as: 'modules',
              attributes: ['id', 'title', 'semester', 'code', 'QSIS_year', 'CATs'],
            },
          ],
          as: 'courses',
        },
        {
          model: School,
          attributes: ['school_name'],
          through: { attributes: [] },
        },
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    })

    // Formatting response so that each piece easier to inceract with front end
    const formattedUsers = users.map((user) => ({
      id: user.id,
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      active: user.active,
      date_created: user.date_created,
      date_updated: user.date_updated,
      courses: user.courses?.map((course) => ({
        id: course.id,
        title: course.title,
        years: course.years,
        code: course.code,
        modules: course.modules?.map((module) => ({
          id: module.id,
          title: module.title,
          semester: module.semester,
          code: module.code,
          qsis_year: module.QSIS_year,
          CATs: module.CATs,
        })),
      })),
      school: user.schools?.map((school) => ({
        school_name: school.school_name,
      }))[0], //There is only one school per user at the minute. This might change
      role: user.role ? { name: user.role.name } : null,
    }))

    response.json(formattedUsers)
  } catch (error) {
    console.error('Failed to fetch users:', error.message, { stack: error.stack })
    response.status(500).json({
      error: 'Failed to fetch users',
      details: error.message,
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

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'forename', 'surname', 'email', 'active', 'date_created', 'date_updated'],
      include: [
        {
          model: Course,
          attributes: ['title', 'years', 'code' ],
          through: [ {} ],
          include:
            [{
              model: Module,
              as: 'modules',
            }],
          as: 'courses'
        },
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    })

    //Same structure as above. Might re-add role and school in if needed.
    const formattedUser = {
      id: user.id,
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      active: user.active,
      date_created: user.date_created,
      date_updated: user.date_updated,
      courses: user.courses?.map((course) => ({
        id: course.id,
        title: course.title,
        years: course.years,
        code: course.code,
        modules: course.modules?.map((module) => ({
          id: module.id,
          title: module.title,
          semester: module.semester,
          code: module.code,
          qsis_year: module.QSIS_year,
          CATs: module.CATs,
        })),
      })),
      role: user.role? { name: user.role.name } : null,
    }

    if(!formattedUser) {
      return response.status(404).json({ error: 'User not found' })
    }
    response.json(formattedUser)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = usersRouter