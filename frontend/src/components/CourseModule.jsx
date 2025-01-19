import React, { useState } from 'react'
import Table from './Table'

const CourseModule = ({ modules, year_start, year_end, year }) => {

  const tableData = {
    labels: { title: `Academic Year: ${year} (${year_start}/${year_end})` },
    content: {
      headers: ['Title', 'Code', 'Module Co-ordinator', 'CATs', 'Semester'], // Table headers
      data: modules.map((module) => ({
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