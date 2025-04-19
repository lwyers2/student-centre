const rolesRouter = require('express').Router()

const { Role } = require('../models')

rolesRouter.get(
  '/',
  async (req, res) => {
    const roles = await Role.findAll({
      attributes: ['id', 'name'],
    })
    if (!roles || roles.length === 0) {
      const error = new Error('Roles not found')
      error.status = 404
      throw error
    }
    res.json(roles)
  }
)

module.exports = rolesRouter