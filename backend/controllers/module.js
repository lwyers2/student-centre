const modulesRouter = require('express').Router()
const Course = require('../models/course')
const Module = require('../models/module')
const User = require('../models/user')
const ModuleYear = require('../models/moduleYear')
const ModuleCourse = require('../models/moduleCourse')
const Semester = require('../models/semester')
const CourseYear = require('../models/courseYear')
const QualificationLevel = require('../models/qualificationLevel')
const Student = require('../models/student')

//Will eventually need to include all students and users
modulesRouter.get('/', async (request, response) => {
  try {
    const modules = await Module.findAll({
      attributes: ['id', 'title', 'code', 'CATs', 'year'],
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
    })
    response.json(modules)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch modules' })
  }
})

modulesRouter.get('/module-year/:moduleYear', async (request, response) => {

  const moduleYearId = request.params.moduleYear

  try {
    const module = await Module.findOne({
      attributes: ['id', 'title', 'code', 'CATs', 'year'],
      include: [
        {
          model: ModuleYear,
          as: 'module_years',
          attributes: ['id', 'year_start', 'semester_id'],
          where: { id: moduleYearId },
          include: [
            {
              model: Semester,
              as: 'semester',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Student,
          as: 'students',
          attributes: ['id', 'forename', 'surname', 'email', 'student_code'],
          through: {
            attributes: ['result', 'resit', 'flagged'], // Include extra attributes from the join table if needed
            where: { module_year_id: moduleYearId }, // Apply filter to the join table, not directly on Student
          }
        }
      ]
    })
    if(!module) {
      return response.status(404).json({ error: 'Module not found' })
    }

    const formattedModule = {
      module: {
        id: module.id,
        title: module.title,
        code: module.code,
        year: module.year,
        year_start: module['module_years'][0]['year_start'],
        semester: module['module_years'][0]['semester']['name'],
      },
      students: module.students.map((student) => ({
        student_code: student.student_code,
        id: student.id,
        forename: student.forename,
        surname: student.surname,
        email: student.email,
        exam_results: student.student_module,
      }))
    }

    response.json(formattedModule)
  } catch(error) {
    console.error(error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = modulesRouter