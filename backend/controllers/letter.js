// routes/letterRoutes.js
const letterRouter = require('express').Router()
const { sendLetter, getAllLettersForStudent, getAllLettersForStudentOneModule } = require('../services/letter')


letterRouter.post('/send-letter', async (req, res) => {
  const { studentId, moduleYearId, sentByUser, authorisedByStaff, typeName } = req.body

  const result = await sendLetter(studentId, moduleYearId, sentByUser, authorisedByStaff, typeName)

  if (!result.success) {
    return res.status(400).send(result.message) // 400 for client-side errors
  }

  res.status(200).send('Letter sent successfully, meeting scheduled if necessary')
})


letterRouter.get('/:studentId', async (req, res) => {
  const studentId = req.params.studentId
  const letters = await getAllLettersForStudent(studentId)
  res.json(letters)
})

letterRouter.get('/', async (req, res) => {
  const { studentId, moduleYearId } = req.query // Use req.query instead of req.body

  if (!studentId || !moduleYearId) {
    return res.status(400).json({ error: 'Missing studentId or moduleYearId' })
  }

  try {
    const letters = await getAllLettersForStudentOneModule(studentId, moduleYearId)
    res.json(letters)
  } catch (error) {
    console.error('Error fetching letters:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = letterRouter
