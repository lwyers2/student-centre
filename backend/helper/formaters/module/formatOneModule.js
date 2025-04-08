function formatOneModule(module) {
  return {
    module: {
      id: module.id,
      title: module.title,
      code: module.code,
      year: module.year,
      CATs: module.CATs,
    },
    module_years: module.module_module_year.map((moduleYear) => ({
      module_year_id: moduleYear.id,
      year_start: moduleYear.year_start,
      semester: moduleYear.module_year_semester ? moduleYear.module_year_semester.name : undefined,
      coordinator: moduleYear.module_year_module_coordinator ? `${moduleYear.module_year_module_coordinator.prefix}. ${moduleYear.module_year_module_coordinator.forename} ${moduleYear.module_year_module_coordinator.surname}` : undefined,
    })),
  }
}

module.exports = { formatOneModule }