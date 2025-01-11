const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')
const Module = require('../models/module')

studentsRouter.get('/', async (request, response) => {
  try {

    const students = await Student.findAll({
      attributes: ['id','forename', 'surname', 'student_code', 'email'],
      include: [
        {
          model: Course,
          attributes: ['id','title', 'years', 'code'],
          as: 'courses',
        },
        {
          model: Module,
          attributes: ['id', 'title', 'semester', 'code'],
          as: 'modules',
          through: {
            attributes: ['result', 'flagged'],
          },
          include: [
            {
              model: Course,
              attributes: ['id'],
              through: { attributes: [] },
              as: 'course',
            },
          ],
        },
      ],
    })


    if (!students) {
      return response.status(404).json({ error: 'Student not found' })
    }

    const formattedStudents = students.map((student) => ({
      id: student.id,
      forename: student.forename,
      surname: student.surname,
      student_code: student.student_code,
      email: student.email,
      courses: student.courses.map((course) => ({
        id: course.id,
        title: course.title,
        years: course.years,
        code: course.code,
        modules: student.modules
          .filter((module) =>
            module.course.some((c) => c.id === course.id)
          )
          .map((module) => ({
            id: module.id,
            title: module.title,
            semester: module.semester,
            code: module.code,
            result: module.student_module
              ? module.student_module.dataValues.result
              : 'Pending',
            flagged: module.student_module.dataValues.flagged,
          })),
      }))
    }))

    response.json(formattedStudents)
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
          attributes: ['id', 'title', 'semester', 'code'],
          as: 'modules',
          through: {
            attributes: ['result', 'flagged'],
          },
          include: [
            {
              model: Course,
              attributes: ['id'],
              through: { attributes: [] },
              as: 'course',
            },
          ],
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
          .filter((module) =>
            module.course.some((c) => c.id === course.id)
          )
          .map((module) => ({
            id: module.id,
            title: module.title,
            semester: module.semester,
            code: module.code,
            result: module.student_module
              ? module.student_module.dataValues.result
              : 'Pending',
            flagged: module.student_module.dataValues.flagged,
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