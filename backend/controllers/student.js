const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')
const Module = require('../models/module')

studentsRouter.get('/', async (request, response) => {
  try {
    const students = await Student.findAll({
      attributes: ['forename', 'surname', 'email'],
      include: [
        {
          model: Course,
          attributes: ['title', 'years', 'code'], // Fetch Course details
          through: { attributes: [] }, // Exclude join table details
        },
        {
          model: Module,
          attributes: ['title', 'code'], // Fetch Module details
          through: { attributes: ['result'] }, // Exclude join table details
        },
      ],
    })

    response.json(students)
  } catch (error) {
    console.error(error) // Log detailed error for debugging
    response.status(500).json({
      error: 'Failed to fetch students',
      details: error.message,
    })
  }
})

studentsRouter.get('/:student', async (request, response) => {
  try{
    const studentId = request.params.student

    const studentData = await Student.findOne({
      where: { id: studentId },
      attributes: ['forename', 'surname', 'student_code', 'email'],
      include : [
        {
          model: Course,
          attributes: ['title', 'years', 'code' ],
          through: [ {} ],
          include:
            [{
              model: Module,
              as: 'modules',
              through: [ {} ],
            }]
        }
      ]
    })
    if(!studentData) {
      return response.status(404).json({ error: 'Student not found' })
    }
    response.json(studentData)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = studentsRouter