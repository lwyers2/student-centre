const coursesRouter = require('express').Router()
const Course = require('../models/course')
const Module = require('../models/module')
const QualificationLevel = require('../models/qualification-level')

coursesRouter.get('/', async (request, response) => {
  try {
    const courses = await Course.findAll({
      attributes: ['title', 'years', 'code'],
      include: [
        {
          model: Module,
          as: 'modules',
          attributes: ['title', 'semester'],
        },
        {
          model: QualificationLevel,
          as: 'qualification_level',
          attributes: ['qualification'],
        }
      ],
    })
    response.json(courses)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'failed to fetch courses',
      details: error.message,
    })
  }
})

module.exports = coursesRouter