function formatUserModules(user) {
  if (!user) return undefined // Handle case when user is undefined

  // Extract course_year_ids from courses for easy lookup
  const courseYearIds = user.user_user_course?.map(course => course.course_year_id) || []

  return {
    user: {
      id: user.id,
      prefix: user.prefix,
      forename: user.forename,
      surname: user.surname,
    },
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
    })),
    modules: (user.user_module_user || []).reduce((acc, module) => {
      const moduleId = module.module_id

      // Check if module already exists in accumulator
      let existingModule = acc.find((m) => m.module_id === moduleId)

      // Filter course_years based on course_year_id matching courses
      const validCourseIds = (module.user_modules_module.module_module_course || [])
        .filter(courseYear => courseYearIds.includes(courseYear.course_year_id))
        .map(courseYear => courseYear.course_id)  // Extract course_id from course_year

      // Only keep the first valid course_id
      const firstValidCourseId = validCourseIds[0]

      if (!existingModule && firstValidCourseId) {
        // Add new module if it doesn't exist yet
        acc.push({
          module_id: module.module_id,
          title: module.user_modules_module.title,
          year: module.user_modules_module.year,
          code: module.user_modules_module.code,
          CATs: module.user_modules_module.CATs,
          course_id: firstValidCourseId, // Only include first valid course_id
        })
      } else if (existingModule && firstValidCourseId) {
        // Ensure the first valid course_id is unique and merge if needed
        existingModule.course_id = firstValidCourseId // Only one course_id
      }

      return acc
    }, []),
  }
}

module.exports = { formatUserModules }
