const { User } = require('../models')

//TODO
// update lockout time or maybe have admin to reset

const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds

const rateLimitLoginAttempts = async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({ where: { email } })

  if (user) {
    const { failed_attempts, last_failed_attempt } = user
    const timeSinceLastAttempt = new Date() - new Date(last_failed_attempt)

    if (failed_attempts >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_TIME) {
      return res.status(429).json({ error: 'Too many failed login attempts. Please try again later.' })
    }

    // Reset failed attempts after the cooldown period
    if (timeSinceLastAttempt >= LOCKOUT_TIME) {
      user.failed_attempts = 0
      user.last_failed_attempt = null
      await user.save()
    }
  }

  next()
}

module.exports = { rateLimitLoginAttempts }
