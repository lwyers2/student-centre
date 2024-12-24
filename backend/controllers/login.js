const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return response.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify the password
    const passwordCorrect = await bcrypt.compare(password, user.password)
    if (!passwordCorrect) {
      return response.status(401).json({ error: 'Invalid email or password' })
    }

    const userForToken = { email: user.email, id: user.id }
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '4h' })

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 4)

    await Token.create({ token, user_id: user.id, expires_at: expiresAt })

    response.status(200).send({
      token,
      email: user.email,
      forename: user.forename,
      surname: user.surname,
    })
  } catch (error) {
    console.error('Login error:', error)
    response.status(500).json({ error: 'An error occurred while loggin in' })
  }

})

module.exports = loginRouter
