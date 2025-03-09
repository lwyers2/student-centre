import React from 'react'
import Table from './Table'

const AllModules = ({ modules, year }) => {

  const tableData = {
    labels: { title: `Academic Year: ${year}` },
    content: {
      headers: ['Title', 'Code', 'CATs', ], // Table headers
      data: modules.map((module) => ({
        id: module.module_year_id, // Unique ID for each row
        title: module.title,
        code: module.code,
        cats: module.CATs,
      })),
      view: '/module-summary', // Base path for "View" links
    },
  }

  return (
    <Table
      labels={tableData.labels}
      content={tableData.content}
    />
  )
}

export default AllModules
