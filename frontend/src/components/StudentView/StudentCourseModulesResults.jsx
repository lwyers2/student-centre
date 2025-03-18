import React, { useState } from 'react'
import Table from '../Table'

const StudentCourseModulesResults = ({ student, modules, year }) => {

  const tableData = {
    labels: { title: `Academic Year: ${year}` },
    content: {
      headers: ['Title', 'Result', 'Flagged', 'Resit' ], // Table headers
      data: modules.map((module) => ({
        id: module.module_year_id, // Unique ID for each row
        title : module.title,
        result: module.result,
        flagged: module.flagged,
        resit: module.resit,
      })),
      view: `/student/${student.id}/module-year`, // Base path for "View" links
    },
  }

  return (

    <Table
      labels={tableData.labels}
      content={tableData.content}
    />
  )
}

export default StudentCourseModulesResults