function formatUserModules(user) {
  if (!user) return undefined // Handle case when user is undefined


  return {
    user: {
      id: user.id,
      prefix: user.prefix,
      forename: user.forename,
      surname: user.surname,
    },
    modules: (user.user_module_user || []).map((module) => {
      const coordinator = module.user_module_module_year?.module_year_module_coordinator
      const moduleCoordinator = coordinator
        ? `${coordinator.prefix || ''}. ${coordinator.forename || ''} ${coordinator.surname || ''}`
        : undefined

      // Get all course_year_ids from the user's courses
      const userCourseYearIds = new Set(
        (user.user_user_course || []).map((course) => course.course_year_id)
      )

      return {
        module_id: module.module_id,
        module_year_id: module.module_year_id,
        title: module.user_module_module_year?.module_year_module?.title,
        code: module.user_module_module_year?.module_year_module?.code,
        CATs: module.user_module_module_year?.module_year_module?.CATs,
        year: module.user_module_module_year?.module_year_module?.year,
        year_start: module.user_module_module_year?.year_start,
        module_coordinator: moduleCoordinator,
        semester: module.user_module_module_year?.module_year_semester?.name,
        // Filter course_years so it only contains those that exist in user's courses
        course_years: (module.user_module_module_year?.module_year_module_course || [])
          .filter((courseYear) => userCourseYearIds.has(courseYear.course_year_id)) // ✅ Only include matching course_year_id
          .map((courseYear) => ({
            course_year_id: courseYear.course_year_id,
            course_id: courseYear.course_id,
          }))
      }
    }),
    courses: (user.user_user_course || []).map((course) => ({
      course_id: course.course_id,
      course_year_id: course.course_year_id,
      title: course.user_course_course?.title,
      code: course.user_course_course?.code,
      part_time: course.user_course_course?.part_time,
      years: course.user_course_course?.years,
      qualification: course.user_course_course?.course_qualification_level?.qualification,
      year_start: course.user_course_course_year?.year_start,
      year_end: course.user_course_course_year?.year_end,
    }))
  }
}

module.exports = { formatUserModules }