
const tokenVerification = require('../middleware/tokenVerification')
const roleAuthorization = require('../middleware/roleAuthorization')

const protectedRouter = require('express').Router()

//when adding in roleAuthorisation, values need to be in array format []
protectedRouter.get('/', tokenVerification, roleAuthorization(['Admin', 'Teacher', 'Super User']), (req, res) => {
  res.status(200).json({ message: 'You are logged in!', user: req.user })
})

module.exports = protectedRouter