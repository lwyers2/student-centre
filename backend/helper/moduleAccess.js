const { UserModule } = require('../models/')

async function checkUserAccessToModule(userId, moduleYearId) {
  const userModule = await UserModule.findOne({
    where: {
      user_id: userId,
      module_year_id: moduleYearId
    }
  })
  return !!userModule
}

module.exports = { checkUserAccessToModule }