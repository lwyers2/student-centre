function formatOneCourse(course) {
  // Deduplicate users by their ID
  const seenUserIds = new Set()
  const uniqueUsers = []

  for (const userCourse of course.course_user_course) {
    const user = userCourse.user_course_user
    if (user && !seenUserIds.has(user.id)) {
      seenUserIds.add(user.id)
      uniqueUsers.push({
        id: user.id,
        forename: user.forename,
        surname: user.surname,
        prefix: user.prefix,
        role: user.user_role?.name ? user.user_role.name : null,
      })
    }
  }

  return {
    course: {
      id: course.id,
      title: course.title,
      code: course.code,
      qualification: course.course_qualification_level.qualification,
      school: course.course_school.school_name,
      school_id: course.course_school.id,
      part_time: course.part_time,
      years: course.years,
    },
    course_years: course.course_course_year.map((courseYear) => ({
      id: courseYear.id,
      year_start: courseYear.year_start,
      year_end: courseYear.year_end,
      course_coordinator: `${courseYear.course_year_course_coordinator.prefix}. ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`
    })),
    users: uniqueUsers
  }
}

module.exports = { formatOneCourse }