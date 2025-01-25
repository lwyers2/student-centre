function formatUserModulesFromCourseYear(user) {
  return {
    user: {
      id: user.id,
      prefix: user.prefix,
      forename: user.forename,
      surname: user.surname,
    },
    course: {
      id: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['id'],
      title: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['title'],
      code: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['code'],
      qualification: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['qualification_level']['qualification'],
      year_start: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['course_years'][0]['year_start'],
      year_end: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['course_years'][0]['year_end'],
      part_time: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['part_time'] === 0 ? 'FY' : 'PT',
      years: user['modules'][0]['module_years'][0]['module_courses'][0]['course']['years'],
      modules: user.modules
        .map((module) => ({
          id: module.id,
          title: module.title,
          code: module.code,
          CATs: module.CATs,
          year: module.year,
          module_year_id: module['module_years'][0]['id'],
          year_start: module['module_years'][0]['year_start'],
          module_coordinator: module['module_years'][0]['module_co-ordinator']['forename'] + ' ' + module['module_years'][0]['module_co-ordinator']['surname'],
          semester: module['module_years'][0]['semester']['name'],
        }))
    }
  }
}

module.exports = { formatUserModulesFromCourseYear }