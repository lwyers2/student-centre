const jwt = require('jsonwebtoken')
const Token = require('../models/token')
const Role = require('../models/role')
const User = require('../models/user')

const tokenVerification = async (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  // Now no need for try-catch, express-async-errors handles errors automatically
  const storedToken = await Token.findOne({
    where: { token },
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'email', 'role_id'],
      include: {
        model: Role,
        as: 'role',
        attributes: ['id', 'name'],
      }
    }
  })

  // Handle case where token is not found or expired
  if (!storedToken || new Date(storedToken.expires_at) < new Date()) {
    return response.status(401).json({ error: 'Token expired or invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!storedToken.user) {
    return response.status(401).json({ error: 'User not associated with token' })
  }

  request.user = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    role_id: storedToken.user.role_id,
    role_name: storedToken.user.role,
    ...decodedToken,
  }

  next()
}

module.exports = tokenVerification