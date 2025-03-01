function formatOneUser(user) {
  return {
    id: user.id,
    forename: user.forename,
    surname: user.surname,
    email: user.email,
    active: user.active,
    date_created: user.date_created,
    date_updated: user.date_updated,
    is_active: user.is_active,
    schools: user.user_user_school.map((school) => ({
      school: school.user_school_school.school_name,
      school_id: school.user_school_school.id,
    })),
    role: user.user_role.name,
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
    }, []),
    modules: user.user_module_user
      .map((module) => ({
        module_id: module.module_id,
        module_year_id: module.module_year_id,
        title: module.user_module_module_year.module_year_module.title,
        code: module.user_module_module_year.module_year_module.code,
        CATs: module.user_module_module_year.module_year_module.CATs,
        year: module.user_module_module_year.module_year_module.year,
        year_start: module.user_module_module_year.year_start,
        module_coordinator: module.user_module_module_year.module_year_module_coordinator.prefix + '. ' + module.user_module_module_year.module_year_module_coordinator.forename + ' ' + module.user_module_module_year.module_year_module_coordinator.surname,
        semester: module.user_module_module_year.module_year_semester.name,
      }))
  }
}

module.exports = { formatOneUser }
