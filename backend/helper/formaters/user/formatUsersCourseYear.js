function formatUsersCourseYear(user) {
  return {
    user: {
      id: user.id,
      prefix: user.prefix,
      forename: user.forename,
      surname: user.surname,
      courses: user.user_user_course.reduce((acc, courseEntry) => {
        const courseId = courseEntry.user_course_course.id
        const courseTitle = courseEntry.user_course_course.title
        const courseYears = courseEntry.user_course_course.years
        const courseCode = courseEntry.user_course_course.code
        const coursePartTime = courseEntry.user_course_course.part_time
        const courseQualification = courseEntry.user_course_course.course_qualification_level.qualification

        // Find existing course in acc
        let existingCourse = acc.find(c => c.course_id === courseId)

        if (!existingCourse) {
          existingCourse = {
            course_id: courseId,
            title: courseTitle,
            years: courseYears,
            code: courseCode,
            part_time: coursePartTime,
            qualification: courseQualification,
            course_years: []
          }
          acc.push(existingCourse)
        }

        // Push course year details
        existingCourse.course_years.push({
          id: courseEntry.user_course_course_year.id,
          year_start: courseEntry.user_course_course_year.year_start,
          year_end: courseEntry.user_course_course_year.year_end,
          course_coordinator: `${courseEntry.user_course_course_year.course_year_course_coordinator['prefix']}. ${courseEntry.user_course_course_year.course_year_course_coordinator['forename']} ${courseEntry.user_course_course_year.course_year_course_coordinator['surname']}`
        })

        return acc
      }, [])
    }
  }
}

module.exports= { formatUsersCourseYear }