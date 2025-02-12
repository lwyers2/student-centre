const { SequelizeConnectionTimedOutError, SequelizeConnectionRefusedError, TimeoutError, ValidationError, UniqueConstraintError, DatabaseError, ConnectionError, ForeignKeyConstraintError } = require('sequelize')
const { AuthError } = require('../utils/errors')

const errorHandler = (error, request, response, _next) => {

  if (error instanceof AuthError) {
    return response.status(error.status).json({
      error: error.message,
    })
  }

  if (error.status) {
    return response.status(error.status).json({
      error: error.message || 'An error occurred',
      details: error.details || undefined, // Include details if provided
    })
  }

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

  // If foreign key is not conformed to
  if (error instanceof ForeignKeyConstraintError) {
    return response.status(400).json({
      error: 'Foreign Key Constraint Error',
      message: `A foreign key constraint was violated: ${error.message}`,
    })
  }

  //Time out db connection (malformed query/heavy load)
  if (error instanceof TimeoutError) {
    return response.status(408).json({
      error: 'Timeout Error',
      message: 'The request timed out. Please try again later.',
    })
  }

  //connection to db refused (server down or network issues)
  if (error instanceof SequelizeConnectionRefusedError) {
    return response.status(503).json({
      error: 'Connection Refused',
      message: 'Database connection was refused. Please check your database configuration.',
    })
  }

  //Connection time out
  if (error instanceof SequelizeConnectionTimedOutError) {
    return response.status(408).json({
      error: 'Connection Timeout',
      message: 'The connection to the database timed out. Please try again later.',
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

  if (error instanceof Error) {
    return response.status(500).json({
      message: error.message,
      status: error.status,
    })
  }

  // Generic 500 error for unhandled errors
  return response.status(500).json({
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred.',
  })

}

module.exports = errorHandler