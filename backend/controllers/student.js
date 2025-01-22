const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Course = require('../models/course')
const Module = require('../models/module')
const User = require('../models/user')
const QualificationLevel = require('../models/qualificationLevel')
const CourseYear = require('../models/courseYear')
const ModuleYear = require('../models/moduleYear')
const Semester = require('../models/semester')
const ModuleCourse = require('../models/moduleCourse')

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

  const studentId = request.params.student

  try{
    const student = await Student.findOne({
      where: { id: studentId },
      attributes: ['id','forename', 'surname', 'student_code', 'email'],
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
            },
            {
              model: ModuleCourse,
              as: 'module_courses',
              attributes: ['course_year_id'],
            }
          ]
        },
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
      //logging: console.log,
    })

    if(!student) {
      return response.status(404).json({ error: 'Student not found' })
    }

    const studentCourseYears = student.student_course_years
    const studentModuleYears = student.student_module_years

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
        modules: studentModuleYears
          .filter((studentModuleYear) => {
          // Filter the module_courses based on the course_year_id
            return studentModuleYear.module_courses.some(
              (moduleCourse) => moduleCourse.course_year_id === studentCourseYear.id
            )
          })
          .map((studentModuleYear) => ({
            module_year_id: studentModuleYear.id,
            year_start: studentModuleYear.year_start,
            module_coordinator_id: studentModuleYear.module_coordinator_id,
            semester: studentModuleYear.semester.name,
            module_coordinator:
            studentModuleYear['module_co-ordinator'].prefix + ' ' + studentModuleYear['module_co-ordinator'].forename + ' ' + studentModuleYear['module_co-ordinator'].surname,
            title: studentModuleYear.module.title,
            module_id: studentModuleYear.module.id,
            code: studentModuleYear.module.code,
            CATs: studentModuleYear.module.CATs,
            year: studentModuleYear.module.year,
            student_module: studentModuleYear.student_module
          })),
      }))
    }

    response.json(formattedStudent)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to fetch modules for the user' })
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