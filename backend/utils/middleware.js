const logger = require('./logger')
const jwt = require('jsonwebtoken')
const Token = require('../models/token')
const Role = require('../models/role')
const User = require('../models/user')

const { ValidationError, UniqueConstraintError, DatabaseError, ConnectionError } = require('sequelize')

const roleMap = {
  'Admin': 1,
  'Teacher': 2,
  'Super User': 3,
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response) => {
  console.log('error:', error)

  // Sequelize Validation Errors (for example, missing required fields or invalid data formats)
  if (error instanceof ValidationError) {
    const errors = error.errors.map(err => err.message)
    return response.status(400).json({ error: 'Validation Error', details: errors })
  }

  // Sequelize Unique Constraint Errors (duplicate entries, such as unique fields)
  if (error instanceof UniqueConstraintError) {
    return response.status(400).json({
      error: 'Unique Constraint Violation',
      message: `Duplicate entry: ${error.errors.map(e => e.message).join(', ')}`,
    })
  }

  // General Database Errors (invalid queries, etc.)
  if (error instanceof DatabaseError) {
    return response.status(500).json({
      error: 'Database Error',
      message: error.message,
    })
  }

  // Database Connection Errors (failure to connect to the DB)
  if (error instanceof ConnectionError) {
    return response.status(503).json({
      error: 'Database Connection Error',
      message: 'Failed to connect to the database. Please try again later.',
    })
  }

  // Handle other known errors (like CastError, JWT issues, etc.)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  // Generic 500 error for unhandled errors
  return response.status(500).json({
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred.',
  })
}

const tokenVerification = async (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  try {
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
  } catch (error) {
    console.error('Token verification error:', error.message || error)
    return response.status(500).json({ error: 'Internal server error' })
  }
}

const roleAuthorisation = (allowedRoles) => {
  //mapping roles as a const above so that can enter role name in for better readability
  const allowedRoleIds = allowedRoles.map((role) => roleMap[role] || role )
  return (req, res, next) => {
    //using includes as there are pages where multiple roles can access
    if(req.user && allowedRoleIds.includes(req.user.role_id)) {
      next()
    } else {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' })
    }
  }
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenVerification,
  roleAuthorisation
}