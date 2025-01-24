const { param } = require('express-validator')


const validateId = (fieldName) => {
  return param(fieldName)
    .notEmpty().withMessage(`${fieldName} ID is required`)
    .isInt().withMessage(`Invalid ${fieldName} ID format: ID must be an integer`)
}

module.exports = {
  validateId,
}