const { body, validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const validateLogin = async (req, res, next) => {
  await body('email').isEmail().withMessage('Invalid email format').run(req)
  await body('password').notEmpty().withMessage('Password is required').run(req)
  validate(req, res, next)
}

module.exports = { validate, validateLogin }