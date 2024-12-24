const logger = require('./logger')
const jwt = require('jsonwebtoken')
const Token = require('../models/token')

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

const errorHandler = (error, request, response, next) => {
  console.log('error:', error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'ServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const tokenVerification = async (request, response, next) => {
  const authHeader = request.headers.authorisation

  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const storedToken = await Token.findOne({ where: { token }})
    if(!storedToken || new Date(storedToken.expres_at) < new Date()) {
      return response.status(401).json({ error: 'Token expired or invalid' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = decodedToken

    next()
  } catch (error) {
    console.error('Token verification error:', error)
    response.status(401).json({ error: 'Token expired or invalid '})
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenVerification
}