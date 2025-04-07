
const { Course, School, QualificationLevel, CourseYear, User, UserCourse, Role } = require('../models')
const { formatAllCourses } = require('../helper/formaters/course/formatAllCourses')
const { formatOneCourse } = require('../helper/formaters/course/formatOneCourse')

async function getAllCourses() {
  const courses = await Course.findAll({
    attributes: ['id','title', 'years', 'code', 'part_time'],
    include: [
      {
        model: QualificationLevel,
        as: 'course_qualification_level',
        attributes: ['qualification'],
      },
      {
        model: School,
        as: 'course_school',
        attributes: ['school_name']
      },
    ]
  })
  if(!courses) return null

  return formatAllCourses(courses)
}

async function getOneCourse(courseId) {
  const course = await Course.findByPk(courseId, {
    attributes: ['id','title', 'years', 'code', 'part_time'],
    include:
    [
      {
        model: QualificationLevel,
        as: 'course_qualification_level',
        attributes: ['qualification'],
      },
      {
        model: School,
        as: 'course_school',
        attributes: ['id','school_name']
      },
      {
        model: CourseYear,
        as: 'course_course_year',
        include:
        [
          {
            model: User,
            as: 'course_year_course_coordinator',
            attributes: ['id', 'forename', 'surname', 'prefix']
          }
        ]
      },
      {
        model: UserCourse,
        as: 'course_user_course',
        include:
        [
          {
            model: User,
            as: 'user_course_user',
            attributes: ['id', 'forename', 'surname', 'prefix'],
            include:
            [
              {
                model: Role,
                as: 'user_role',
                attributes: ['name']
              }
            ]
          }
        ]
      }
    ]
  })
  if(!course) return null
  return formatOneCourse(course)
  //return course
}

module.exports = {
  getAllCourses,
  getOneCourse,
}