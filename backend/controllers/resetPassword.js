const resetPasswordRouter = require('express').Router()
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//Crypto used to create a random password that will be sent
const generateRandomPassword = () => crypto.randomBytes(8).toString('hex')

resetPasswordRouter.post('/', async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(400).send('User not found')
  }

  //create password then hash
  const newPassword = generateRandomPassword()
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  user.password = hashedPassword
  await user.save()

  // transpoter is 'handler' need to create this to send
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  //really simple subject and text.
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Your New Password',
    text: `Your password has been reset. Your new password is: ${newPassword}`,
  }

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).send(`Error sending email: ${error.message}`)
    }
    res.status(200).send('Password reset email sent with the new password')
  })

})

module.exports = resetPasswordRouter
