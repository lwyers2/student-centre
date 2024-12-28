const modulesRouter = require('express').Router()
const Course = require('../models/course')
const Module = require('../models/module')
const Student = require('../models/student')
const User = require('../models/user')

modulesRouter.get('/', async (request, response) => {
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

modulesRouter.get('/:module', async (request, response) => {
  try{
    const moduleId = request.params.module

    const moduleData = await Module.findOne({
      where: { id: moduleId },
      attributes: ['id', 'title', 'QSIS_year', 'code', 'CATs', 'semester'],
      include : [
        {
          model: Student,
          attributes: ['id', 'forename', 'surname', 'email', 'student_code'],
          through: { attributes: ['result'] },
        },
        {
          model: User,
          attributes: ['id', 'email'],
          through: [ { } ]
        }
      ]
    })
    if(!moduleData) {
      return response.status(404).json({ error: 'Module not found' })
    }
    response.json(moduleData)
  } catch(error) {
    console.error(error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = modulesRouter