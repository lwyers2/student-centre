function formatModulesFromCourseYear(modules) {
  return modules.map((module) => ({
    module_id: module.module_id,
    module_year_id: module.module_year_id,
    required: module.required,
    year_start: module.module_course_module_year.year_start,
    semester: module.module_course_module_year.module_year_semester.name,
    title: module.module_course_module.title,
    code: module.module_course_module.code,
    year: module.module_course_module.year,
    CATs: module.module_course_module.CATs,
  }))
}

module.exports = { formatModulesFromCourseYear }