const schoolsRouter = require('express').Router()
const { School } = require('../models')

schoolsRouter.get(
  '/',
  //roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const schools = await School.findAll({
      attributes: ['id', 'school_name'],
    })
    if (!schools) {
      const error = new Error('Schools not found')
      error.status = 404
      throw error
    }
    res.json(schools)
  }
)

module.exports = schoolsRouter