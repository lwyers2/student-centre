function formatModuleYear(module) {
  return {
    module: {
      module_year_id: module.id,
      module_id: module.module_year_module.id,
      title: module.module_year_module.title,
      code: module.module_year_module.code,
      year: module.module_year_module.year,
      year_start: module.year_start,
      semester: module.module_year_semester.name,
    },
    students: module.module_year_student_module.map((studentModule) => ({
      student_code: studentModule.student_module_student.student_code,
      //id: studentModule.student_module_student.id,
      forename: studentModule.student_module_student.forename,
      surname: studentModule.student_module_student.surname,
      email: studentModule.student_module_student.email,
      result: studentModule.result,
      flagged: studentModule.flagged,
      resit: studentModule.resit
    }))
  }
}

module.exports = { formatModuleYear }