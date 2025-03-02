function formatUsersCourseYear(user) {
  // Check if user is undefined
  if (!user) return undefined

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
        const courseQualification = courseEntry.user_course_course.course_qualification_level?.qualification // Safe navigation

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
        const courseYear = courseEntry.user_course_course_year

        existingCourse.course_years.push({
          id: courseYear?.id, // Safe navigation
          year_start: courseYear?.year_start, // Safe navigation
          year_end: courseYear?.year_end, // Safe navigation
          course_coordinator: courseYear?.course_year_course_coordinator
            ? `${courseYear.course_year_course_coordinator.prefix}. ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`
            : undefined, // Default value if missing
        })

        return acc
      }, [])
    }
  }
}

module.exports = { formatUsersCourseYear }


module.exports= { formatUsersCourseYear }