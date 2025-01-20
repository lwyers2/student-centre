const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')
const Module = require('../models/module')

studentsRouter.get('/', async (request, response) => {
  try {

    const students = await Student.findAll({
      attributes: ['id','forename', 'surname', 'student_code', 'email'],
    })


    if (!students) {
      return response.status(404).json({ error: 'Student not found' })
    }


    response.json(students)
  } catch (error) {
    console.error('Error fetching student data:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

studentsRouter.get('/:student', async (request, response) => {
  try {
    const studentId = request.params.student

    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ['id','forename', 'surname', 'student_code', 'email'],
    })

    if (!student) {
      return response.status(404).json({ error: 'Student not found' })
    }


    response.json(student)
  } catch (error) {
    console.error('Error fetching student data:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = studentsRouter