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
    });

    response.json(students);
  } catch (error) {
    console.error(error) // Log detailed error for debugging
    response.status(500).json({
      error: 'Failed to fetch students',
      details: error.message,
    })
  }
})

module.exports = studentsRouter;