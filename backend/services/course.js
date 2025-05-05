
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

async function addCourseYear(courseId, yearStart, courseLength, courseCoordinatorId) {
  if (!yearStart || !courseLength) {
    const error = new Error('Year start and course length are required')
    error.status = 400
    throw error
  }

  const yearEnd = Number(yearStart) + Number(courseLength)

  if (Number(yearStart) < 2020) {
    const error = new Error('Year start cannot be less than 2020')
    error.status = 400
    throw error
  }

  if (Number(yearStart) > yearEnd) {
    const error = new Error('Year start cannot be greater than year end')
    error.status = 400
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

  // 🔥 Check start year first
  const hasSameStartYear = await CourseYear.findOne({
    where: {
      course_id: course.id,
      year_start: yearStart
    }
  })

  if (hasSameStartYear) {
    const error = new Error('A course year with the same start year already exists')
    error.status = 400
    throw error
  }

  // 🔥 Check end year separately
  const hasSameEndYear = await CourseYear.findOne({
    where: {
      course_id: course.id,
      year_end: yearEnd
    }
  })

  if (hasSameEndYear) {
    const error = new Error('A course year with the same end year already exists')
    error.status = 400
    throw error
  }

  // Create the course year
  const courseYear = await CourseYear.create({
    course_id: course.id,
    year_start: yearStart,
    year_end: yearEnd,
    course_coordinator: courseCoordinatorId
  })

  return courseYear
}

async function updateCourse(courseId, courseData) {
  const course = await Course.findByPk(courseId)

  if (!course) {
    const error = new Error('Course not found')
    error.status = 404
    throw error
  }

  const qualificationLevel = await QualificationLevel.findOne({
    where: {
      qualification: courseData.qualification
    }
  })

  if (!qualificationLevel) {
    const error = new Error('Qualification level not found')
    error.status = 404
    throw error
  }


  await Course.update({
    title: courseData.title,
    code: courseData.code,
    part_time: courseData.part_time,
    qualification_level_id: qualificationLevel.id
  }, {
    where: { id: courseId }
  })

  // 🔥 Refetch the updated course after update
  const updatedCourse = await Course.findByPk(courseId)

  return updatedCourse
}


async function addUserToCourse(userId, courseId, courseYearId) {
  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if(!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  const courseYear = await CourseYear.findOne({
    where: {
      id: courseYearId,
      course_id: courseId
    }
  })
  if(!courseYear) {
    const error = new Error('Course year not found')
    error.status = 404
    throw error
  }
  const userCourse = await UserCourse.findOne({
    where: {
      user_id: userId,
      course_year_id: courseYearId,
      course_id: courseId
    }
  })
  if(userCourse) {
    const error = new Error('User already in course year')
    error.status = 400
    throw error
  }

  const newUserCourse = await UserCourse.create({
    user_id: userId,
    course_id: courseId,
    course_year_id: courseYearId
  })

  const refactoredUserCourse = await CourseYear.findOne({
    where: {
      id: newUserCourse.course_year_id
    }
  })

  return refactoredUserCourse

}

async function removeUserFromCourse(userId, courseId, courseYearId) {

  // Check if the user exists
  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const courseYear = await CourseYear.findOne({
    where: {
      id: courseYearId,
      course_id: courseId
    }
  })
  if(!courseYear) {
    const error = new Error('Course year not found')
    error.status = 404
    throw error
  }

  const userCourse = await UserCourse.findOne({
    where: {
      user_id: userId,
      course_id: courseId,
      course_year_id: courseYearId,
    }
  })

  if(!userCourse) {
    const error = new Error('User not in courseYears')
    error.status = 400
    throw error
  }

  const deleteUserCourse = await UserCourse.destroy({
    where: {
      user_id: userId,
      course_year_id: courseYearId,
      course_id: courseId
    }
  })

  return deleteUserCourse
}




module.exports = {
  getAllCourses,
  getOneCourse,
  getCoursesFromSchool,
  updateCourseYear,
  addCourseYear,
  updateCourse,
  addUserToCourse,
  removeUserFromCourse
}