const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')
const Module = require('../models/module')
const User = require('../models/user')
const QualificationLevel = require('../models/qualificationLevel')
const CourseYear = require('../models/courseYear')
const ModuleYear = require('../models/moduleYear')
const Semester = require('../models/semester')

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

studentsRouter.get('/:student/courses', async (request, response) => {
  try {
    const studentId = request.params.student

    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ['id','forename', 'surname', 'student_code', 'email'],
      include: [
        {
          model: CourseYear,
          as: 'student_course_years',
          attributes: ['id', 'year_start', 'year_end'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id','title', 'years', 'code', 'part_time'],
              include: [
                {
                  model: QualificationLevel,
                  as: 'qualification_level',
                  attributes: ['qualification'],
                },
              ],
            },
            {
              model: User,
              as: 'course_co-ordinator',
              attributes: ['forename', 'surname']
            }
          ],
        },
      ],
    })

    if (!student) {
      return response.status(404).json({ error: 'Student not found' })
    }

    const studentCourseYears = student.student_course_years

    const formattedStudent = {
      id: student.id,
      email: student.email,
      student_code: student.student_code,
      forename: student.forname,
      surname: student.surname,
      courses: studentCourseYears.map((studentCourseYear) => ({
        course_year_id: studentCourseYear.id,
        course_id: studentCourseYear.course.id,
        year_start: studentCourseYear.year_start,
        year_end: studentCourseYear.year_end,
        title: studentCourseYear.course.title,
        years: studentCourseYear.course.years,
        code: studentCourseYear.course.code,
        part_time: studentCourseYear.course.part_time? 'PT' : 'FY',
        qualification: studentCourseYear.course.qualification_level.qualification,
        course_coordinator: studentCourseYear['course_co-ordinator'].forename + ' ' + studentCourseYear['course_co-ordinator'].surname,
      }))
    }

    response.json(formattedStudent)
  } catch (error) {
    console.error('Error fetching student data:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})


studentsRouter.get('/:student/modules', async (request, response) => {
  try{
    const studentId = request.params.student

    const student = await Student.findOne({
      where: { id: studentId },
      attributes: [], //'id','forename', 'surname', 'student_code', 'email'
      include: [
        {
          model: ModuleYear,
          as: 'student_module_years',
          attributes: ['id', 'year_start', 'module_coordinator_id'],
          through: { attributes: ['result', 'resit', 'flagged'] },
          include: [
            {
              model: Semester,
              as: 'semester',
              attributes: ['name']
            },
            {
              model: User,
              as: 'module_co-ordinator',
              attributes: ['prefix', 'forename', 'surname']
            },
            {
              model: Module,
              as: 'module',
              attributes: ['title', 'id', 'code', 'CATs', 'year']
            }
          ]
        },
      ],
    })

    if (!student) {
      return response.status(404).json({ error: 'Student not found' })
    }

    const student_module_years = student.student_module_years

    const formattedStudentModules = {
      modules:
        student_module_years.map((student_module_year) => ({
          module_year_id: student_module_year.id,
          year_start: student_module_year.id,
          module_coordinator: student_module_year['module_co-ordinator']['prefix'] + ' ' + student_module_year['module_co-ordinator']['forename'] + ' ' + student_module_year['module_co-ordinator']['surname'],
          title: student_module_year['module']['title'],
          module_id: student_module_year['module']['id'],
          code: student_module_year['module']['code'],
          CATs: student_module_year['module']['CATs'],
          year: student_module_year['module']['year'],
          student_module: student_module_year['student_module']
        }))

    }

    response.json(formattedStudentModules)

  }
  catch (error) {
    console.error('Error fetching student data:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = studentsRouter