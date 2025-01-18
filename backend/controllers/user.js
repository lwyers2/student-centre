const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const Course = require('../models/course')
const Module = require('../models/module')
const School = require('../models/school')
const Role = require('../models/role')
const User = require('../models/user')
const QualificationLevel = require('../models/qualificationLevel')
const CourseYear = require('../models/courseYear')
const ModuleYear = require('../models/module_year')
const ModuleCourse = require('../models/module_course')
const Semester = require('../models/semester')

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
          as: 'modules', // Alias for User -> Module association
          attributes: ['id', 'title', 'code', 'CATs', 'year'],
          through: { attributes: [] }, // Omit join table attributes
          include: [
            {
              model: ModuleYear,
              as: 'module_years', // Alias for Module -> ModuleYear association
              attributes: ['id', 'year_start', 'semester_id'],
              include: [
                {
                  model: ModuleCourse,
                  as: 'module_courses', // Alias for ModuleYear -> ModuleCourse association
                  attributes: [], // Omit join table attributes
                  where: { course_year_id: courseYearId }, // Filter by course_year_id
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

    response.json(user)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch modules for the user' })
  }
})


module.exports = usersRouter