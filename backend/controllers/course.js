const coursesRouter = require('express').Router()
const Course = require('../models/course')
//const Module = require('../models/module')
const User = require('../models/user')
const QualificationLevel = require('../models/qualificationLevel')
const CourseYear = require('../models/courseYear')

coursesRouter.get('/', async (request, response) => {
  try {
    const courses = await Course.findAll({
      attributes: ['title', 'years', 'code', 'part_time'],
      include: [
        {
          model: QualificationLevel,
          as: 'qualification_level',
          attributes: ['qualification'],
        },
        {
          model: CourseYear,
          as: 'course_years',
          attributes: ['id', 'year_start', 'year_end'],
          include: [
            {
              model: User,
              as: 'course_co-ordinator',
              attributes: ['forename', 'surname']
            }
          ],
        }
      ]
    })
    response.json(courses)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'failed to fetch courses',
      details: error.message,
    })
  }
})





module.exports = coursesRouter