function formatModuleYear(module) {
  // Ensure that the module_module_year array is an array and exists
  if (!Array.isArray(module.module_module_year)) {
    return { module: [] } // Return empty array if module_module_year is not an array
  }

  return {
    module: module.module_module_year.map((moduleYear) => ({
      module_year_id: moduleYear.id,
      module_id: moduleYear.module_year_module ? moduleYear.module_year_module.id : undefined,
      title: moduleYear.module_year_module ? moduleYear.module_year_module.title : undefined,
      code: moduleYear.module_year_module ? moduleYear.module_year_module.code : undefined,
      year: moduleYear.module_year_module ? moduleYear.module_year_module.year : undefined,
      year_start: moduleYear.year_start,
      semester: moduleYear.module_year_semester ? moduleYear.module_year_semester.name : undefined,
      students: moduleYear.module_year_student_module ? moduleYear.module_year_student_module.map((studentModule) => ({
        student_code: studentModule.student_module_student ? studentModule.student_module_student.student_code : undefined,
        id: studentModule.student_module_student ? studentModule.student_module_student.id : undefined,
        forename: studentModule.student_module_student ? studentModule.student_module_student.forename : undefined,
        surname: studentModule.student_module_student ? studentModule.student_module_student.surname : undefined,
        email: studentModule.student_module_student ? studentModule.student_module_student.email : undefined,
        result: studentModule.result,
        flagged: studentModule.flagged,
        resit: studentModule.resit,
        result_descriptor: studentModule.student_module_result_descriptor.descriptor
      })) : []
    }))
  }
}

module.exports = { formatModuleYear }
