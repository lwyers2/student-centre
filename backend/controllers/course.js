const coursesRouter = require('express').Router()
const Course = require('../models/course')
const User = require('../models/user')

coursesRouter.get('/', async (request, response) => {
  try {
    const courses = await Course.findAll({
      attributes: ['title', 'years', 'code'],
      include: {
        model: User,
        attributes: ['forename', 'surname', 'email'],
        through: {attributes: [] },
      }
    })
  response.json(courses)
  } catch (error) {
    response.status(500).json({error: 'failed to fetch courses'})
  }
})

module.exports = coursesRouter