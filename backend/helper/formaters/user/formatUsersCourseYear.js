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
        const courseQualification = courseEntry.user_course_course.course_qualification_level?.qualification

        // existing course in accumulator
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

        // add the course year details
        const courseYear = courseEntry.user_course_course_year

        existingCourse.course_years.push({
          id: courseYear?.id,
          year_start: courseYear?.year_start,
          year_end: courseYear?.year_end,
          course_coordinator: courseYear?.course_year_course_coordinator
            ? `${courseYear.course_year_course_coordinator.prefix}. ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`
            : undefined,
        })

        return acc
      }, [])
    }
  }
}

module.exports = { formatUsersCourseYear }
