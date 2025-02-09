//TODO: Update length of expiry of jwt token

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, AuthenticationUser } = require('../models')

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user.id }, process.env.SECRET, { expiresIn: '240h' })
}

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ where: { email } })
  if (!user){
    console.warn(`Login failed: Email not found - ${email}`)
    throw new Error('Email not found')
  }

  const passwordCorrect = await bcrypt.compare(password, user.password)
  if (!passwordCorrect){
    console.warn(`Login failed: Incorrect password - ${email}`)
    throw new Error('Incorrect password')
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
