const loginRouter = require('express').Router()
const { authenticateUser } = require('../services/authenticateUser')
const { validateLogin } = require('../middleware/validate')

loginRouter.post(
  '/',
  validateLogin,
  async (req, res) => {
    const { email, password } = req.body
    const { token, user } = await authenticateUser(email, password)

    res.status(200).json({
      token,
      email: user.email,
      forename: user.forename,
      surname: user.surname,
      id: user.id
    })
  })

module.exports = loginRouter
