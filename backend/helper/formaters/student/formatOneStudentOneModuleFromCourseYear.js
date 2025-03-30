function formatOneStudentOneModuleFromCourseYear(student) {
  if (!student.student_student_course || student.student_student_course.length === 0) {
    return {} // Return empty object if no course data exists
  }

  const course = student.student_student_course[0] // Take the first course
  const courseYear = course.student_course_course_year
  const courseDetails = courseYear.course_year_course

  // Convert all modules into an array
  const formattedModules = courseYear.course_year_module_course.map((module) => ({
    module_id: module.module_id,
    module_year_id: module.module_year_id,
    title: module.module_course_module.title,
    code: module.module_course_module.code,
    CATs: module.module_course_module.CATs,
    year: module.module_course_module.year,
    result: module.module_course_module.module_student_module[0]?.result || null,
    flagged: module.module_course_module.module_student_module[0]?.flagged || 0,
    resit: module.module_course_module.module_student_module[0]?.resit || 0,
    result_descriptor: module.module_course_module.module_student_module[0]?.student_module_result_descriptor.descriptor
  }))

  return {
    student: {
      id: student.id,
      forename: student.forename,
      surname: student.surname,
      code: student.student_code,
    },
    course: {
      course_id: course.course_id,
      course_year_id: course.course_year_id,
      year_start: courseYear.year_start,
      year_end: courseYear.year_end,
      title: courseDetails.title,
      code: courseDetails.code,
      part_time: courseDetails.part_time,
      qualification: courseDetails.course_qualification_level.qualification,
    },
    modules: formattedModules, // Now an array!
  }
}

module.exports = { formatOneStudentOneModuleFromCourseYear }
