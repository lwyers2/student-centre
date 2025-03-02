function formatModuleYear(module) {
  return {
    module: module.module_module_year.map((module) => ({
      module_year_id: module.id,
      module_id: module.module_year_module ? module.module_year_module.id : undefined,
      title: module.module_year_module ? module.module_year_module.title : undefined,
      code: module.module_year_module ? module.module_year_module.code : undefined,
      year: module.module_year_module ? module.module_year_module.year : undefined,
      year_start: module.year_start,
      semester: module.module_year_semester ? module.module_year_semester.name : undefined,
      students: module.module_year_student_module ? module.module_year_student_module.map((studentModule) => ({
        student_code: studentModule.student_module_student ? studentModule.student_module_student.student_code : undefined,
        id: studentModule.student_module_student ? studentModule.student_module_student.id : undefined,
        forename: studentModule.student_module_student ? studentModule.student_module_student.forename : undefined,
        surname: studentModule.student_module_student ? studentModule.student_module_student.surname : undefined,
        email: studentModule.student_module_student ? studentModule.student_module_student.email : undefined,
        result: studentModule.result,
        flagged: studentModule.flagged,
        resit: studentModule.resit
      })) : []
    }))
  }
}

module.exports = { formatModuleYear }
