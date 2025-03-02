function formatUserModulesFromCourseYear(user) {
  if (!user) return undefined // Handle case when user is undefined

  return {
    user: {
      id: user.id,
      prefix: user.prefix,
      forename: user.forename,
      surname: user.surname,
    },
    modules: (user.user_module_user || []).map((module) => {
      // Handle cases where module_year_module_coordinator might be missing
      const coordinator = module.user_module_module_year?.module_year_module_coordinator
      const moduleCoordinator = coordinator
        ? `${coordinator.prefix || ''}. ${coordinator.forename || ''} ${coordinator.surname || ''}`
        : undefined

      return {
        module_id: module.module_id,
        module_year_id: module.module_year_id,
        title: module.user_module_module_year?.module_year_module?.title,
        code: module.user_module_module_year?.module_year_module?.code,
        CATs: module.user_module_module_year?.module_year_module?.CATs,
        year: module.user_module_module_year?.module_year_module?.year,
        year_start: module.user_module_module_year?.year_start,
        module_coordinator: moduleCoordinator, // Use the safe fallback for coordinator
        semester: module.user_module_module_year?.module_year_semester?.name,
      }
    }),
  }
}





module.exports = { formatUserModulesFromCourseYear }
