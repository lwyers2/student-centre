const resetPasswordRouter = require('express').Router()
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user') // Assuming you're using a User model for your users


// Nodemailer setup (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Utility function to generate a random password
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex') // Generates an 8-byte password (16 characters)
}

resetPasswordRouter.post('/', async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).send('User not found')
    }

    // Generate a new random password
    const newPassword = generateRandomPassword()

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password with the new hashed password
    user.password = hashedPassword
    await user.save()

    // Send the email with the new password
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Your New Password',
      text: `Your password has been reset. Your new password is: ${newPassword}`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(`Error sending email: ${error.message}`)
      }
      res.status(200).send('Password reset email sent with the new password')
    })
  } catch (err) {
    console.error('Error processing reset password request: ', err)  // Log the actual error
    res.status(500).send('Error processing request')
  }
})


module.exports = resetPasswordRouter
