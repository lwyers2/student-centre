import React, { useState } from 'react'
import Table from './Table'

const CourseModule = ({ modules, year_start, year_end, year, search, semester, cats, coordinator }) => {

  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(search.toLowerCase()) ||
    module.code.toLowerCase().includes(search.toLowerCase()) ||
    module.semester.toLowerCase().includes(search.toLowerCase()) ||
    module.module_coordinator.toLowerCase().includes(search.toLowerCase())
  )

  const filteredByFilters = filteredModules.filter((module) => {
    const matchesSemester = semester ? String(module.semester) === semester : true
    const matchesCats = cats ? String(module.CATs) === cats : true
    const matchesCoordinator = coordinator ? module.module_coordinator === coordinator : true
    return matchesCats && matchesCoordinator && matchesSemester
  })

  if (filteredByFilters.length ===0 ) {
    return null
  }

  const tableData = {
    labels: { title: `Academic Year: ${year} (${year_start}/${year_end})` },
    content: {
      headers: ['Title', 'Code', 'Module Co-ordinator', 'CATs', 'Semester'], // Table headers
      data: filteredByFilters.map((module) => ({
        id: module.module_year_id, // Unique ID for each row
        title: module.title,
        code: module.code,
        'cats': module.CATs,
        'module co-ordinator': module.module_coordinator,
        semester: module.semester
      })),
      view: '/module', // Base path for "View" links
    },
  }

  return (
    <Table
      labels={tableData.labels}
      content={tableData.content}
    />
  )
}

export default CourseModule