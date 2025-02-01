const { checkUserAccessToModule } = require('../helper/moduleAccess')

async function checkModuleAccess(req, res, next) {
  const userId = req.user.id // Assuming user is attached to request
  const moduleYearId = req.params.moduleYearId // Adjust based on your route params

  const hasAccess = await checkUserAccessToModule(userId, moduleYearId)

  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' })
  }

  next()
}

module.exports = checkModuleAccess