const formatOneUserOneModule = (user) => {
  return {
    id: user.id,
    prefix: user.prefix,
    forename: user.forename,
    surname: user.surname,
    modules: user.user_module_user.map((module) => {
      return{
        module_year_id: module.module_year_id,
        module_coordinator: `${module.user_module_module_year?.module_year_module_coordinator?.prefix || ''}. ${module.user_module_module_year?.module_year_module_coordinator?.forename || ''} ${module.user_module_module_year?.module_year_module_coordinator?.surname || ''}`.trim(),
        semester: module.user_module_module_year.module_year_semester.name,
        year_start: module.user_module_module_year.year_start,
        title: module.user_module_module_year.module_year_module.title,
        code: module.user_module_module_year.module_year_module.code,
        CATs: module.user_module_module_year.module_year_module.CATs,
        students: module.user_module_module_year.module_year_student_module
      }
    })
  }
}

module.exports = { formatOneUserOneModule }
