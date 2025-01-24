function formatStudentModules(student) {
  const student_module_years = student.student_module_years
  return {
    modules:
        student_module_years.map((student_module_year) => ({
          module_year_id: student_module_year.id,
          year_start: student_module_year.id,
          module_coordinator: student_module_year['module_co-ordinator']['prefix'] + ' ' + student_module_year['module_co-ordinator']['forename'] + ' ' + student_module_year['module_co-ordinator']['surname'],
          title: student_module_year['module']['title'],
          module_id: student_module_year['module']['id'],
          code: student_module_year['module']['code'],
          CATs: student_module_year['module']['CATs'],
          year: student_module_year['module']['year'],
          student_module: student_module_year['student_module']
        }))
  }
}

module.exports = { formatStudentModules }