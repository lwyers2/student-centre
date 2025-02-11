class AuthError extends Error {
  constructor(message, status = 401) {
    super(message)
    this.status = status
    this.name = 'AuthError'
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message)
    this.status = 404
    this.name = 'NotFoundError'
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Access forbidden') {
    super(message)
    this.status = 403
    this.name = 'ForbiddenError'
  }
}

module.exports = { AuthError, NotFoundError, ForbiddenError }
