//TODO: Update length of expiry of jwt token

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, AuthenticationUser } = require('../models')
const { AuthError } = require('../utils/errors')

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user.id }, process.env.SECRET, { expiresIn: '240h' })
}

const authenticateUser = async (email, password) => {

  const user = await User.findOne({ where: { email } })
  if (!user){
    throw new AuthError('Email not found', 401)
  }

  const passwordCorrect = await bcrypt.compare(password, user.password)
  if (!passwordCorrect){
    throw new AuthError('Incorrect password', 401)
  }

  if(!user.active) {
    throw new AuthError('Account is inactive', 401)
  }

  const token = generateToken(user)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 240) // 240 hours

  await AuthenticationUser.create({
    token,
    user_id: user.id,
    expires_at: expiresAt,
    created_at: new Date(),
  })

  return { token, user }
}

module.exports = { authenticateUser }
