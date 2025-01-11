
const tokenVerification = require('../utils/middleware').tokenVerification
const roleAuthorisation = require('../utils/middleware').roleAuthorisation

const protectedRouter = require('express').Router()

//when adding in roleAuthorisation, values need to be in array format []
protectedRouter.get('/', tokenVerification, roleAuthorisation(['Admin', 'Teacher', 'Super User']), (req, res) => {
  res.status(200).json({ message: 'You are logged in!', user: req.user })
})

module.exports = protectedRouter