
const { Course, School, QualificationLevel, CourseYear, User, UserCourse, Role } = require('../models')
const { formatAllCourses } = require('../helper/formaters/course/formatAllCourses')
const { formatOneCourse } = require('../helper/formaters/course/formatOneCourse')
const { formatAllCoursesFromSchool } = require('../helper/formaters/course/formatAllCoursesFromSchool')

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

async function getCoursesFromSchool(schoolId) {
  const courses = await Course.findAll({
    where: {
      school_id: schoolId
    },
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
        attributes: ['school_name']
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
      }
    ]
  })
  if(!courses) return null
  return formatAllCoursesFromSchool(courses)
}

async function updateCourseYear(courseId, courseYearId, courseCoordinatorId) {
  const courseYear = await CourseYear.findByPk(courseYearId)
  if (!courseYear) {
    const error = new Error('Course Year not found')
    error.status = 404
    throw error
  }

  const course = await Course.findByPk(courseId)
  if (!course) {
    const error = new Error('Course not found')
    error.status = 404
    throw error
  }

  const courseCoordinator = await User.findByPk(courseCoordinatorId)
  if (!courseCoordinator) {
    const error = new Error('Course Coordinator not found')
    error.status = 404
    throw error
  }

  // Perform the update on CourseYear
  await CourseYear.update({
    course_coordinator: courseCoordinator.id
  }, {
    where: {
      id: courseYear.id
    }
  })

  // Fetch and return the updated CourseYear data after update
  const updatedCourseYear = await CourseYear.findByPk(courseYearId)

  return updatedCourseYear  // Return the updated CourseYear object
}


module.exports = {
  getAllCourses,
  getOneCourse,
  getCoursesFromSchool,
  updateCourseYear
}