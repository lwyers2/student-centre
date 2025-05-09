const { checkUserAccessToModule } = require('../helper/moduleAccess')

async function checkModuleAccess(req, res, next) {
  const userId = req.user.id
  const moduleYearId = req.params.moduleYearId

  const hasAccess = await checkUserAccessToModule(userId, moduleYearId)

  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' })
  }

  next()
}

module.exports = checkModuleAccess