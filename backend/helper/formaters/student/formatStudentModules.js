function formatStudentModules(student) {
  const studentModules = student.student_student_module || []
  return {
    modules: studentModules.map((studentModule) => ({
      module_year_id: studentModule.module_year_id ?? undefined,
      year_start: studentModule.student_module_module_year?.year_start ?? undefined,
      module_coordinator: `${studentModule.student_module_module_year?.module_year_module_coordinator?.prefix || 'undefined'}. ${studentModule.student_module_module_year?.module_year_module_coordinator?.forename || 'undefined'} ${studentModule.student_module_module_year?.module_year_module_coordinator?.surname || 'undefined'}`,
      title: studentModule.student_module_module_year?.module_year_module?.title || 'undefined',
      module_id: studentModule.student_module_module_year?.module_year_module?.id ?? undefined,
      code: studentModule.student_module_module_year?.module_year_module?.code || 'undefined',
      CATs: studentModule.student_module_module_year?.module_year_module?.CATs ?? undefined,
      year: studentModule.student_module_module_year?.module_year_module?.year ?? undefined,
      result: studentModule.result ?? undefined,
      result_descriptor: studentModule.student_module_result_descriptor.descriptor,
      flagged: studentModule.flagged ?? undefined,
      resit: studentModule.resit ?? undefined,
    }))
  }
}

module.exports = { formatStudentModules }
