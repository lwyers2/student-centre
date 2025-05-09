const logoutRouter = require('express').Router()
const tokenVerification = require('../middleware/tokenVerification')
const deactivateToken = require('../services/deactivateToken')

logoutRouter.post(
  '/',
  tokenVerification,
  async(req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]
    //need to destroy token so it can't be resued
    await deactivateToken(token, req.user.id)
    return res.status(200).json({ message: 'Logged out successfully' })
  }
)

module.exports = logoutRouter
