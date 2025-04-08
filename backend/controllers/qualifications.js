const qualificationsRouter = require('express').Router()
const { QualificationLevel } = require('../models')
const tokenVerification = require('../middleware/tokenVerification')
const roleAndIdAuthorization = require('../middleware/roleAndIdAuthorization')

qualificationsRouter.get(
  '/',
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const qualifications = await QualificationLevel.findAll({
      attributes: ['id', 'qualification']
    })
    if (!qualifications || qualifications.length === 0) {
      const error = new Error('Qualifications not found')
      error.status = 404
      throw error
    }
    res.json(qualifications)
  }
)
module.exports = qualificationsRouter