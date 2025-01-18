const modulesRouter = require('express').Router()
const Course = require('../models/course')
const Module = require('../models/module')
const Student = require('../models/student')
const User = require('../models/user')
const ModuleYear = require('../models/module_year')
const ModuleCourse = require('../models/module_course')

modulesRouter.get('/', async (request, response) => {
  try {
    const modules = await Module.findAll({
      attributes: ['id', 'title', 'code', 'CATs', 'semester'],
      include: [
        {
          model: ModuleYear,
          as: 'module_years',
          attributes: ['id', 'year_start', 'semester_id'],
          include: [
            {
              model: ModuleCourse,
              as: 'module_courses', // Alias from association
              attributes: ['course_id', 'course_year_id'],
              include: [
                {
                  model: Course,
                  as: 'course', // Alias for Course
                  attributes: ['id', 'title'],
                },
              ],
            },
          ],
        },
      ],
    })
    response.json(modules)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch modules' })
  }
})

// modulesRouter.get('/modules/:module-year', async (request, response) => {
//   try{
//     const moduleId = request.params.module

//     const moduleData = await Module.findOne({
//       where: { id: moduleId },
//       attributes: ['id', 'title', 'QSIS_year', 'code', 'CATs', 'semester'],
//       include : [
//         {
//           model: Student,
//           attributes: ['id', 'forename', 'surname', 'email', 'student_code'],
//           through: { attributes: ['result'] },
//           as: 'students'
//         },
//         {
//           model: User,
//           attributes: ['id', 'email'],
//           through: [ { } ],
//           as: 'users'
//         }
//       ]
//     })
//     if(!moduleData) {
//       return response.status(404).json({ error: 'Module not found' })
//     }
//     response.json(moduleData)
//   } catch(error) {
//     console.error(error)
//     response.status(500).json({ error: 'Internal server error' })
//   }
// })

module.exports = modulesRouter