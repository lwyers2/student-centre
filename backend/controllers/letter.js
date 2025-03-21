// routes/letterRoutes.js
const letterRouter = require('express').Router()
const { sendFailureLetter } = require('../services/letter')


// Route to handle the failure of a student on a module
letterRouter.post('/', async (req, res) => {
  const { studentId, moduleYearId, sentByUser, authorisedByStaff, typeName } = req.body

  try {
    await sendFailureLetter(studentId, moduleYearId, sentByUser, authorisedByStaff, typeName)
    res.status(200).send('Letter sent successfully, meeting scheduled if necessary')
  } catch (error) {
    res.status(500).send('Error sending letter or scheduling meeting')
  }
})

module.exports = letterRouter
