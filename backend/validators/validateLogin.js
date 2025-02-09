const { body, validationResult } = require('express-validator')

const validateLogin = async (req, res, next) => {
  await body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .run(req)

  await body('password')
    .notEmpty().withMessage('Password is required')
    .run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

module.exports = { validateLogin }