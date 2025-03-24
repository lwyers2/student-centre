const loginRouter = require('express').Router()
const { authenticateUser } = require('../services/authenticateUser')
const { validateLogin } = require('../validators/validateLogin')
const { rateLimitLoginAttempts } = require('../middleware/rateLimitLoginAttempts')

loginRouter.post(
  '/',
  rateLimitLoginAttempts,
  validateLogin,
  async (req, res) => {
    const { email, password } = req.body
    const { token, user } = await authenticateUser(email, password)

    res.status(200).json({
      token,
      email: user.email,
      forename: user.forename,
      surname: user.surname,
      id: user.id,
      prefix: user.prefix
    })
  })

module.exports = loginRouter
