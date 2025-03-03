function formatOneStudentOneModuleYear(student) {
  const studentStudentModule = student.student_student_module[0]

  if (!studentStudentModule) {
    throw new Error('Student module data is missing')
  }

  const moduleYear = studentStudentModule.student_module_module_year || {}
  const semester = moduleYear.module_year_semester?.name || undefined
  const moduleCoordinator = moduleYear.module_year_module_coordinator
    ? `${moduleYear.module_year_module_coordinator.prefix }. ${moduleYear.module_year_module_coordinator.forename } ${moduleYear.module_year_module_coordinator.surname }`.trim()
    : undefined

  return {
    student: {
      id: student.id,
      email: student.email,
      student_code: student.student_code,
      forename: student.forename,
      surname: student.surname,
    },
    module: {
      module_year_id: studentStudentModule.module_year_id,
      year_start: moduleYear.year_start || undefined,
      semester,
      module_coordinator: moduleCoordinator,
      title: moduleYear.module_year_module?.title || undefined,
      module_id: moduleYear.module_year_module?.id || undefined,
      code: moduleYear.module_year_module?.code || undefined,
      CATs: moduleYear.module_year_module?.CATs || undefined,
      year: moduleYear.module_year_module?.year || undefined,
      result: studentStudentModule.result ?? undefined,
      flagged: studentStudentModule.flagged ?? false,
      resit: studentStudentModule.resit ?? false,
    },
  }
}

module.exports = { formatOneStudentOneModuleYear }
