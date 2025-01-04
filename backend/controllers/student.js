const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')
const Module = require('../models/module')

studentsRouter.get('/', async (request, response) => {
  try {
    const studentId = request.params.student

    const studentData = await Student.findOne({
      where: { id: studentId },
      attributes: ['forename', 'surname', 'student_code', 'email'],
      include: [
        {
          model: Course,
          attributes: ['title', 'years', 'code'],
          as: 'courses', // Match alias from associations.js
          include: [
            {
              model: Module,
              attributes: ['title', 'semester', 'code'],
              as: 'modules', // Match alias from associations.js
              through: {
                attributes: ['result'], // Include result from student_module
              },
            },
          ],
        },
      ],
    })

    if (!studentData) {
      return response.status(404).json({ error: 'Student not found' })
    }

    response.json(studentData)
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
      include: [
        {
          model: Course,
          attributes: ['id','title', 'years', 'code'],
          as: 'courses',
        },
        {
          model: Module,
          attributes: ['id','title', 'semester', 'code', 'course_id'],
          as: 'modules',
          through: {
            attributes: ['result'],  //Result for each module
          },
        },
      ],
    })

    if (!student) {
      return response.status(404).json({ error: 'Student not found' })
    }

    console.log('Student Modules:', student.modules)

    const formattedStudent = {
      student: {
        id: student.id,
        forename: student.forename,
        surname: student.surname,
        student_code: student.student_code,
        email: student.email,
      },
      courses: student.courses.map(course => ({
        id: course.id,
        title: course.title,
        years: course.years,
        code: course.code,
        modules: student.modules
          .filter(module => module.course_id === course.id)
          .map(module => ({
            id: module.id,
            title: module.title,
            semester: module.semester,
            code: module.code,
            result: module.student_module
              ? module.student_module.dataValues.result
              : 'Pending'
          })),
      }))
    }

    response.json(formattedStudent)
  } catch (error) {
    console.error('Error fetching student data:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = studentsRouter