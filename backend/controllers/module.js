const modulesRouter = require('express').Router()
const moduleService = require('../services/module')
const { validateId } = require('../validators/validateId')
const { validate } = require('../middleware/validate')
const tokenVerification = require('../middleware/tokenVerification')
const roleAuthorization = require('../middleware/roleAuthorization')
const roleAndIdAuthorization = require('../middleware/roleAndIdAuthorization')
const { formatModuleYear } = require('../helper/formaters/module/formatModuleYear')

modulesRouter.get(
  '/',
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res) => {
    const modules = await moduleService.getAllModules()
    if (!modules || modules.length === 0) {
      const error = new Error('Modules not found')
      error.status = 404
      throw error
    }
    res.json(modules)
  }
)

modulesRouter.get(
  '/:moduleId',
  validateId('moduleId'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const moduleId = req.params.moduleId
    const module = await moduleService.getModule(moduleId)
    if (!module) {
      const error = new Error('Module not found')
      error.status = 404
      throw error
    }
    res.json(module)
  }
)

modulesRouter.get(
  '/module-year/:moduleYear',
  validateId('moduleYear'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User', 'Admin', 'Teacher'], true),
  async (req, res) => {
    const moduleYearId = req.params.moduleYear
    const userId = req.user.id
    const userRole = req.user.role_name
    const hasAccess = await moduleService.checkUserAccessToModule(userId, moduleYearId)
    if(!hasAccess && (userRole !== 'Super User')) {
      return res.status(403).json({ message: 'Access denied: You are not assigned to this module.' })
    }
    const module = await moduleService.getModuleFromModuleYear(moduleYearId)
    if(!module) {
      const error = new Error('Module not found')
      error.status = 404
      throw error
    }
    res.json(formatModuleYear(module))
  }
)

modulesRouter.get(
  '/course-year/:courseYearId',
  validateId('courseYearId'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const courseYearId = req.params.courseYearId
    const modules = await moduleService.getModulesFromCourseYear(courseYearId)
    if (!modules || modules.length === 0) {
      const error = new Error('Modules not found')
      error.status = 404
      throw error
    }
    res.json(modules)
  }
)

modulesRouter.put(
  '/update-module-year/module/:moduleId/module-year/:moduleYearId',
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const moduleId = req.params.moduleId
    const moduleYearId = req.params.moduleYearId
    const { coordinator, semester } = req.body

    if (!coordinator || !semester) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const updatedModuleYear = await moduleService.updateModuleYear(moduleId, moduleYearId, { coordinator, semester })

    if (!updatedModuleYear) {
      const error = new Error('Module year not found')
      error.status = 404
      throw error
    }

    res.status(200).json(updatedModuleYear)
  }
)

modulesRouter.put(
  '/update-module/:moduleId',
  validateId('moduleId'),
  validate,
  tokenVerification,
  roleAndIdAuthorization(['Super User'], true),
  async (req, res) => {
    const moduleId = req.params.moduleId
    const { title, code, year, CATs } = req.body

    if (!title || !code || !year || !CATs) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const updatedModule = await moduleService.updateModule(moduleId, { title, code, year, CATs })

    if (!updatedModule) {
      const error = new Error('Module not found')
      error.status = 404
      throw error
    }

    res.status(200).json(updatedModule)
  }
)

modulesRouter.post(
  '/add-user-to-module',
  tokenVerification,
  roleAuthorization(['Super User', 'Admin']),
  async (req, res) => {
    const { userId, moduleYearId, moduleId } = req.body

    if (!userId || !moduleYearId || !moduleId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const addedUser = await moduleService.addUserToModule(userId, moduleYearId, moduleId)

    if (!addedUser) {
      const error = new Error('Failed to add user to module')
      error.status = 404
      throw error
    }

    res.status(200).json(addedUser)
  }
)

modulesRouter.delete(
  '/remove-user-from-module',
  tokenVerification,
  roleAuthorization(['Super User']),
  async (req, res) => {
    const { userId, moduleYearId, moduleId } = req.body

    if (!userId || !moduleYearId || !moduleId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const removedUser = await moduleService.removeUserFromModule(userId, moduleYearId, moduleId)

    if (!removedUser) {
      const error = new Error('Failed to remove user from module')
      error.status = 404
      throw error
    }

    res.status(200).json(removedUser)
  }
)


module.exports = modulesRouter