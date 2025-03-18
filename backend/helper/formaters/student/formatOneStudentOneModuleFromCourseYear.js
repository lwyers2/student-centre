function formatOneStudentOneModuleFromCourseYear(student) {

  return student.student_student_course.map((course) => {
    return {
      course_id: course.course_id,
      course_year_id: course.course_year_id,
      year_start: course.student_course_course_year.year_start,
      year_end: course.student_course_course_year.year_end,
      title: course.student_course_course_year.course_year_course.title,
      code: course.student_course_course_year.course_year_course.code,
      part_time: course.student_course_course_year.course_year_course.part_time,
      qualification: course.student_course_course_year.course_year_course.course_qualification_level.qualification,
      modules: course.student_course_course_year.course_year_module_course.map((module) => {
        return {
          module_id: module.module_id,
          module_year_id: module.module_year_id,
          title: module.module_course_module.title,
          code: module.module_course_module.code,
          CATs: module.module_course_module.CATs,
          result: module.module_course_module.module_student_module[0].result,
          flagged: module.module_course_module.module_student_module[0].flagged,
          resit: module.module_course_module.module_student_module[0].resit,
        }
      })
    }
  })

}

module.exports = { formatOneStudentOneModuleFromCourseYear }