//TODO: Update length of expiry of jwt token

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, AuthenticationUser } = require('../models')
const { AuthError } = require('../utils/errors')

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '240h' })
}

const authenticateUser = async (email, password) => {

  const user = await User.findOne({ where: { email } })
  if (!user){
    throw new AuthError('Email not found', 401)
  }

  const passwordCorrect = await bcrypt.compare(password, user.password)
  if (!passwordCorrect){
    user.failed_attempts += 1
    user.last_failed_attempt = new Date()
    await user.save()

    throw new AuthError('Incorrect password', 401)
  }

  if(!user.active) {
    throw new AuthError('Account is inactive', 401)
  }

  //successful user login reset failed attempts
  user.failed_attempts = 0
  user.last_failed_attempt = null
  await user.save()

  const token = generateToken(user)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 240) // 240 hours

  await AuthenticationUser.create({
    token,
    user_id: user.id,
    expires_at: expiresAt,
    created_at: new Date(),
    is_active: true,
  })

  return { token, user }
}

module.exports = { authenticateUser }
