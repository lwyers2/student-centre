const jwt = require('jsonwebtoken')
const { Role, AuthenticationUser, User } = require('../models/')

const tokenVerification = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      {
        error: 'Missing or invalid token',
        status: 401,
      })
  }

  const token = authHeader.split(' ')[1]

  // no need for try-catch, express-async-errors handles errors automatically
  const storedToken = await AuthenticationUser.findOne({
    where: { token },
    include: [
      {
        model: User,
        as: 'authentication_user_user',
        attributes: ['id', 'email', 'role_id'],
        include: [
          {
            model: Role,
            as: 'user_role',
            attributes: ['id', 'name'],
          }
        ]
      }
    ],
  })



  if (!storedToken) {
    return res.status(401).json(
      { error: 'Token not found or invalid',
        status: 401,
      })
  }

  // Handle all the cases for the token like expiry, token is active, not found, etc.
  if (new Date(storedToken.expires_at) < new Date()) {
    return res.status(401).json(
      { error: 'Token expired',
        status: 401,
      })
  }


  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!storedToken.authentication_user_user) {
    return res.status(401).json(
      { error: 'User not associated with token',
        status: 401,
      })
  }

  if(!storedToken.is_active) {
    return res.status(401).json(
      { error: 'Token invalid',
        status: 401,
      })
  }

  req.user = {
    id: storedToken.authentication_user_user.id,
    email: storedToken.authentication_user_user.email,
    role_id: storedToken.authentication_user_user.user_role.id,
    role_name: storedToken.authentication_user_user.user_role.name,
    ...decodedToken,
  }

  next()

}

module.exports = tokenVerification