const jwt = require('jsonwebtoken')
const { Role, AuthenticationUser, User } = require('../models/')

const tokenVerification = async (req, res) => {
  console.log('Request headers:', req.headers) // Print headers
  console.log('Request params:', req.params) // Print route params
  console.log('Request body:', req.body) // Print request body
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  // Now no need for try-catch, express-async-errors handles errors automatically
  const storedToken = await AuthenticationUser.findOne({
    where: { token },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'role_id'],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          }
        ]
      }
    ],
  })

  if (!storedToken) {
    return res.status(401).json({ error: 'Token not found or invalid' })
  }

  // Handle case where token is not found or expired
  if (new Date(storedToken.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Token expired or invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!storedToken.user) {
    return res.status(401).json({ error: 'User not associated with token' })
  }

  req.user = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    role_id: storedToken.user.role_id,
    role_name: storedToken.user.role.name,
    ...decodedToken,
  }

  //no need to explicitly set next as express-async-errors
  //next()

}

module.exports = tokenVerification