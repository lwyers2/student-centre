function formatModuleYear(module) {
  return {
    module: {
      id: module.id,
      title: module.title,
      code: module.code,
      year: module.year,
      year_start: module['module_years'][0]['year_start'],
      semester: module['module_years'][0]['semester']['name'],
      module_year_id: module['module_years'][0]['id'],
    },
    students: module.module_students.map((student) => ({
      student_code: student.student_code,
      id: student.id,
      forename: student.forename,
      surname: student.surname,
      email: student.email,
      exam_results: student.student_module,
    }))
  }
}

module.exports = { formatModuleYear }