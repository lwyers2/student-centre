function formatStudentModules(student) {
  const studentModules = student.student_student_module
  return {
    modules:
        studentModules.map((studentModule) => ({
          module_year_id: studentModule.module_year_id,
          year_start: studentModule.student_module_module_year.year_start,
          module_coordinator: `${studentModule.student_module_module_year.module_year_module_coordinator.prefix}. ${studentModule.student_module_module_year.module_year_module_coordinator.forename} ${studentModule.student_module_module_year.module_year_module_coordinator.surname}`,
          title: studentModule.student_module_module_year.module_year_module.title,
          module_id: studentModule.student_module_module_year.module_year_module.id,
          code: studentModule.student_module_module_year.module_year_module.code,
          CATs: studentModule.student_module_module_year.module_year_module.CATs,
          year: studentModule.student_module_module_year.module_year_module.year,
          result: studentModule.result,
          flagged: studentModule.flagged,
          resit: studentModule.flagged,
        }))
  }
}

module.exports = { formatStudentModules }