function formatUserModulesFromCourseYear(user) {
  if (!user) return undefined // Handle case when user is undefined

  const firstCourse = (user.user_user_course && user.user_user_course[0]) || {} // Ensure safety

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
      }
    }),
    course: {
      course_id: firstCourse.course_id,
      course_year_id: firstCourse.course_year_id,
      title: firstCourse.user_course_course?.title,
      code: firstCourse.user_course_course?.code,
      part_time: firstCourse.user_course_course?.part_time,
      years: firstCourse.user_course_course?.years,
      qualification: firstCourse.user_course_course?.course_qualification_level?.qualification,
      year_start: firstCourse.user_course_course_year?.year_start,
      year_end: firstCourse.user_course_course_year?.year_end,
    },
  }
}

module.exports = { formatUserModulesFromCourseYear }
