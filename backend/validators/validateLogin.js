const { body, validationResult } = require('express-validator')

const validateLogin = async (req, res, next) => {
  await body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .run(req)

  await body('password')
    .notEmpty().withMessage('Password is required')
    .run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg)

    // If both email and password are missing, provide a combined error
    if (errorMessages.includes('Email is required') && errorMessages.includes('Password is required')) {
      return res.status(400).json({
        error: 'Email and password are required'
      })
    }

    // Otherwise, return the first error
    return res.status(400).json({
      error: errorMessages[0]
    })
  }

  next()
}

module.exports = { validateLogin }