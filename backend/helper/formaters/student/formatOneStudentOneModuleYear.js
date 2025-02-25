function formatOneStudentOneModuleYear(student) {
  const studentStudentModule = student.student_student_module[0]
  return {
    student: {
      id: student.id,
      email: student.email,
      student_code: student.student_code,
      forename: student.forename,
      surname: student.surname,
    },
    module:  {
      module_year_id: studentStudentModule.module_year_id,
      year_start: studentStudentModule.student_module_module_year.year_start,
      semester: studentStudentModule.student_module_module_year.module_year_semester.name,
      module_coordinator: `${studentStudentModule.student_module_module_year.module_year_module_coordinator.prefix}. ${studentStudentModule.student_module_module_year.module_year_module_coordinator.forename} ${studentStudentModule.student_module_module_year.module_year_module_coordinator.surname}`,
      title: studentStudentModule.student_module_module_year.module_year_module.title,
      module_id: studentStudentModule.student_module_module_year.module_year_module.id,
      code: studentStudentModule.student_module_module_year.module_year_module.code,
      CATs: studentStudentModule.student_module_module_year.module_year_module.CATs,
      year: studentStudentModule.student_module_module_year.module_year_module.year,
      result: studentStudentModule.result,
      flagged: studentStudentModule.flagged,
      resit: studentStudentModule.resit
    }
  }
}

module.exports = { formatOneStudentOneModuleYear }