function formatUserModules(user) {
  if (!user) return undefined

  // Need to get the course_year_ids from the user_user_course
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

      //using an accumulator above to avoid dupes. Because we are getting user_modules it will return the same module, but multiple multiple module_years
      let existingModule = acc.find((m) => m.module_id === moduleId)

      //get our valid courseIds
      const validCourseIds = (module.user_modules_module.module_module_course || [])
        .filter(courseYear => courseYearIds.includes(courseYear.course_year_id))
        .map(courseYear => courseYear.course_id)

      // Then we'll start to build module
      const firstValidCourseId = validCourseIds[0]

      if (!existingModule && firstValidCourseId) {
        // add a new module if it doesn't exist to the accumulator
        acc.push({
          module_id: module.module_id,
          title: module.user_modules_module.title,
          year: module.user_modules_module.year,
          code: module.user_modules_module.code,
          CATs: module.user_modules_module.CATs,
          course_id: firstValidCourseId,
        })
      } else if (existingModule && firstValidCourseId) {
        // make sure the first valid course_id is unique and then merge if need
        existingModule.course_id = firstValidCourseId
      }

      return acc
    }, []),
  }
}

module.exports = { formatUserModules }
