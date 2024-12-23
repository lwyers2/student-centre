const moduleRouter = require('express').Router()
const Course = require('../models/course')
const Module = require('../models/module')

moduleRouter.get('/', async (request, response) => {
  try{
    const modules = await Module.findAll({
      attributes: ['title', 'QSIS_year', 'code', 'CATs', 'semester'],
      include: {
        model: Course,
        as: 'course',
        attributes: ['title', 'code'],
      }
    })
    response.json(modules)
  } catch (error) {
    response.status(500).json({ error: 'failed to fetch modules' })
  }
})

module.exports = moduleRouter