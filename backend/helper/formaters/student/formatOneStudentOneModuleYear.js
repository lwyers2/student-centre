function formatOneStudentOneModuleYear(student) {
  const moduleYear = student.student_module_years[0]
  return {
    student: {
      id: student.id,
      email: student.email,
      student_code: student.student_code,
      forename: student.forename,
      surname: student.surname,
    },
    module:  {
      module_year_id: moduleYear.id,
      year_start: moduleYear.year_start,
      semester: moduleYear.semester.name,
      module_coordinator: moduleYear['module_co-ordinator'].prefix + ' ' + moduleYear['module_co-ordinator'].forename + ' ' + moduleYear['module_co-ordinator'].surname,
      title: moduleYear.module.title,
      module_id: moduleYear.module.id,
      code: moduleYear.module.code,
      CATs: moduleYear.module.CATs,
      year: moduleYear.module.year,
      result_details: moduleYear.student_module,
    }
  }
}

module.exports = { formatOneStudentOneModuleYear }