const { UserModule } = require('../models/') // Adjust path as needed

async function checkUserAccessToModule(userId, moduleYearId) {
  const userModule = await UserModule.findOne({
    where: {
      user_id: userId,
      module_year_id: moduleYearId
    }
  })
  return !!userModule // Convert to boolean
}

module.exports = { checkUserAccessToModule }