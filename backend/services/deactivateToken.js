const { AuthenticationUser } = require('../models')
const { AuthError } = require('../utils/errors')


async function deactivateToken(token, userId) {

  const authenticationUser = await AuthenticationUser.findOne({ where: { token, user_id: userId, is_active: true } })

  if (!authenticationUser) {
    throw new AuthError('Token not found or does not belong to the user', 404)
  }

  await authenticationUser.update({ is_active: false })
  return { success: true }

}

module.exports = deactivateToken
