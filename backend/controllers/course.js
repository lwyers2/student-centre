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

// coursesRouter.get('/user/:userId', async(request, response) => {
//   try {
//     const userId = request.params.userId

//     const courses = await Course.findAll({
//       include: {
//         model: User,
//         through: { attributes: [] },
//         where : { id: userId },
//         attributes: [], //need to add in user details,
//         as: 'users'
//       },
//       attributes: ['id', 'title', 'code', 'years', 'part_time']
//     })

//     if (courses.length === 0) {
//       return response.status(404).json({ error: 'No courses found for this user' })
//     }
//     response.json(courses)
//   } catch (error) {
//     console.error('Error fetching courses:', error)
//     response.status(500).json({ error: 'failed to fectch courses' })
//   }
// })



module.exports = coursesRouter