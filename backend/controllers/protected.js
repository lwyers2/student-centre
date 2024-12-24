
const tokenVerification = require('../utils/middleware').tokenVerification

const protectedRouter = require('express').Router()

protectedRouter.get('/', tokenVerification, (req, res) => {
  res.status(200).json({ message: 'You are logged in!', user: req.user })
})

module.exports = protectedRouter