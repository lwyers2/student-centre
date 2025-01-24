const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const userService = require('../services/user')
const Course = require('../models/course')
const Module = require('../models/module')
const School = require('../models/school')
const Role = require('../models/role')
const User = require('../models/user')
const QualificationLevel = require('../models/qualificationLevel')
const CourseYear = require('../models/courseYear')
const ModuleYear = require('../models/moduleYear')
const ModuleCourse = require('../models/moduleCourse')
const Semester = require('../models/semester')

usersRouter.get('/', async (req, res) => {
  const users = await userService.getAllUsers()
  if(!users) {
    const error = new Error('Users not found')
    error.status = 404
    throw error
  }
  res.json(users)
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

usersRouter.get('/:user/courses', async (request, response) => {
  const userId  = request.params.user

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'prefix', 'forename', 'surname'],
      include: [
        {
          model: Course,
          as: 'all_courses',
          attributes: ['id', 'title', 'years', 'code', 'part_time'],
          through: { attributes: [] },
          include: [
            {
              model: QualificationLevel,
              as: 'qualification_level',
              attributes: ['qualification'],
            },
            {
              model: CourseYear,
              as: 'course_years',
              attributes: ['id', 'year_start', 'year_end'],
              include: [
                {
                  model: Course,
                  as: 'course',
                  attributes: ['title', 'years', 'code', 'part_time'],
                },
                {
                  model: User,
                  as: 'course_co-ordinator',
                  attributes: ['forename', 'surname']
                }
              ],
            },
          ],
        },
      ],
    })

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(user)
  } catch (error) {
    console.error(error)
    response.status(500).json({
      error: 'Failed to fetch courses for user',
      details: error.message,
    })
  }
})

//we're getting all modules associated with a particular course year. For restful principles, I use modules as I'm getting module data then filtering on courseyear
usersRouter.get('/:user/modules/:courseyear', async (request, response) => {

  const userId = request.params.user
  const courseYearId = request.params.courseyear

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'prefix', 'forename', 'surname'],
      include: [
        {
          model: Module,
          as: 'modules',
          attributes: ['id', 'title', 'code', 'CATs', 'year'],
          through: { attributes: [] },
          include: [
            {
              model: ModuleYear,
              as: 'module_years',
              attributes: ['id', 'year_start', 'semester_id'],
              include: [
                {
                  model: ModuleCourse,
                  as: 'module_courses',
                  attributes: ['id'],
                  where: { course_year_id: courseYearId },
                  include: [
                    {
                      model: Course,
                      as: 'course',
                      attributes: ['id', 'title', 'code', 'part_time', 'years'],
                      include: [
                        {
                          model: CourseYear,
                          as: 'course_years',
                          attributes: ['id', 'year_start', 'year_end'],
                          where: { id: courseYearId },
                        },
                        {
                          model: QualificationLevel,
                          as: 'qualification_level',
                          attributes: ['qualification'],
                        }
                      ]
                    },
                  ]
                },
                {
                  model: User,
                  as: 'module_co-ordinator',
                  attributes: ['forename', 'surname']
                },
                {
                  model: Semester,
                  as: 'semester',
                  attributes: ['id', 'name']
                },
              ],
            },
          ],
        },
      ],
    })

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }


    const formattedUser = {
      user: {
        id: user.id,
        prefix: user.prefix,
        forename: user.forename,
        surname: user.surname,
      },
      course: {
        id: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['id'],
        title: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['title'],
        code: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['code'],
        qualification: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['qualification_level']['qualification'],
        year_start: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['course_years'][0]['year_start'],
        year_end: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['course_years'][0]['year_end'],
        part_time: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['part_time'] === 0 ? 'FY' : 'PT',
        years: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['years'],
        modules: user.modules
          .map((module) => ({
            id: module.id,
            title: module.title,
            code: module.code,
            CATs: module.CATs,
            year: module.year,
            module_year_id: module['module_years'][0]['id'],
            year_start: module['module_years'][0]['year_start'],
            module_coordinator: module['module_years'][0]['module_co-ordinator']['forename'] + ' ' + module['module_years'][0]['module_co-ordinator']['surname'],
            semester: module['module_years'][0]['semester']['name'],
          }))
      }
    }

    response.json(formattedUser)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch modules for the user' })
  }
})


module.exports = usersRouter