const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')

studentsRouter.get('/', async (request, response) => {
  try {
    const students = await Student.findAll({
      attributes: ['forename', 'surname', 'email'],
      include: {
        model: Course,
        attributes: ['title', 'year', 'code'],
        through: { attributes: [] },
      } // Specify the fields you want
    });
    response.json(students);
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch students' });
  }
})

module.exports = studentsRouter