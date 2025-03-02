const formatOneUser = (user) => {
  return {
    id: user.id,
    forename: user.forename || '',
    surname: user.surname || '',
    email: user.email || '',
    active: user.active || undefined,
    date_created: user.date_created || undefined,
    date_updated: user.date_updated || undefined,
    is_active: user.is_active || undefined,
    schools: (user.user_user_school || []).map((school) => ({
      school: school.user_school_school?.school_name || '',
      school_id: school.user_school_school?.id || 0,
    })),
    role: user.user_role || null,
    courses: (user.user_user_course || []).reduce((acc, courseEntry) => {
      const courseId = courseEntry.user_course_course?.id || 0
      const courseTitle = courseEntry.user_course_course?.title || '' // Empty string for missing title
      const courseYears = courseEntry.user_course_course?.years || ''
      const courseCode = courseEntry.user_course_course?.code || ''
      const coursePartTime = courseEntry.user_course_course?.part_time || false
      const courseQualification = courseEntry.user_course_course?.course_qualification_level?.qualification || ''

      let existingCourse = acc.find((c) => c.course_id === courseId)

      if (!existingCourse) {
        existingCourse = {
          course_id: courseId,
          title: courseTitle, // Ensure empty string for missing title
          years: courseYears,
          code: courseCode,
          part_time: coursePartTime,
          qualification: courseQualification,
          course_years: [],
        }
        acc.push(existingCourse)
      }

      if (courseEntry.user_course_course_year) {
        existingCourse.course_years.push({
          id: courseEntry.user_course_course_year.id,
          year_start: courseEntry.user_course_course_year.year_start || null,
          year_end: courseEntry.user_course_course_year.year_end || null,
          course_coordinator: `${courseEntry.user_course_course_year.course_year_course_coordinator?.prefix || ''}. ${courseEntry.user_course_course_year.course_year_course_coordinator?.forename || ''} ${courseEntry.user_course_course_year.course_year_course_coordinator?.surname || ''}`.trim(),
        })
      }

      return acc
    }, []),
    modules: (user.user_module_user || []).map((moduleEntry) => {
      if (!moduleEntry.user_module_module_year) return null // Skip if module_year is missing
      return {
        module_id: moduleEntry.module_id || null,
        module_year_id: moduleEntry.module_year_id || null, // Ensure null instead of undefined
        title: moduleEntry.user_module_module_year?.module_year_module?.title || null,
        code: moduleEntry.user_module_module_year?.module_year_module?.code || null,
        CATs: moduleEntry.user_module_module_year?.module_year_module?.CATs || null,
        year: moduleEntry.user_module_module_year?.module_year_module?.year || null,
        year_start: moduleEntry.user_module_module_year?.year_start || null,
        module_coordinator: `${moduleEntry.user_module_module_year?.module_year_module_coordinator?.prefix || ''}. ${moduleEntry.user_module_module_year?.module_year_module_coordinator?.forename || ''} ${moduleEntry.user_module_module_year?.module_year_module_coordinator?.surname || ''}`.trim(),
        semester: moduleEntry.user_module_module_year?.module_year_semester?.name || null,
      }
    }).filter(Boolean) // Filter out any null values (those with missing `user_module_module_year`)
  }
}

module.exports = { formatOneUser }
