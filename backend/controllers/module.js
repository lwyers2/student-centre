const modulesRouter = require('express').Router()
const moduleService = require('../services/module')
const { validateId } = require('../validators/validateId')
const validate = require('../middleware/validate')
const tokenVerification = require('../middleware/tokenVerification')
const roleAuthorization = require('../middleware/roleAuthorization')
const Module = require('../models/module')
const ModuleYear = require('../models/moduleYear')
const Semester = require('../models/semester')
const Student = require('../models/student')

modulesRouter.get(
  '/',
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res) => {
    const modules = await moduleService.getAllModules()
    if (!modules) {
      const error = new Error('Modules not found')
      error.status = 404
      throw error
    }
    res.json(modules)
  }
)

modulesRouter.get(
  '/module-year/:moduleYear',
  async (req, res) => {
    const moduleYearId = req.params.moduleYear
    const module = await moduleService.getModuleFromModuleYear(moduleYearId)
    console.log(module)
    if(!module) {
      const error = new Error('Module not found')
      error.status = 404
      throw error
    }
    res.json(module)
  }
)


// modulesRouter.get('/module-year/:moduleYear', async (request, response) => {

//   const moduleYearId = request.params.moduleYear

//   try {
//     const module = await Module.findOne({
//       attributes: ['id', 'title', 'code', 'CATs', 'year'],
//       include: [
//         {
//           model: ModuleYear,
//           as: 'module_years',
//           attributes: ['id', 'year_start', 'semester_id'],
//           where: { id: moduleYearId },
//           include: [
//             {
//               model: Semester,
//               as: 'semester',
//               attributes: ['id', 'name']
//             }
//           ]
//         },
//         {
//           model: Student,
//           as: 'module_students',
//           attributes: ['id', 'forename', 'surname', 'email', 'student_code'],
//           through: {
//             attributes: ['result', 'resit', 'flagged'], // Include extra attributes from the join table if needed
//             where: { module_year_id: moduleYearId }, // Apply filter to the join table, not directly on Student
//           }
//         }
//       ]
//     })
//     if(!module) {
//       return response.status(404).json({ error: 'Module not found' })
//     }

//     const formattedModule = {
//       module: {
//         id: module.id,
//         title: module.title,
//         code: module.code,
//         year: module.year,
//         year_start: module['module_years'][0]['year_start'],
//         semester: module['module_years'][0]['semester']['name'],
//       },
//       students: module.module_students.map((student) => ({
//         student_code: student.student_code,
//         id: student.id,
//         forename: student.forename,
//         surname: student.surname,
//         email: student.email,
//         exam_results: student.student_module,
//       }))
//     }

//     response.json(formattedModule)
//   } catch(error) {
//     console.error(error)
//     response.status(500).json({ error: 'Internal server error' })
//   }
// })

module.exports = modulesRouter