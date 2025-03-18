import React from 'react'
import Table from './Table'

const AllModules = ({ modules, year , search }) => {


  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(search.toLowerCase()) ||
    module.code.toLowerCase().includes(search.toLowerCase())
  )

  const tableData = {
    labels: { title: `Academic Year: ${year}` },
    content: {
      headers: ['Title', 'Code', 'CATs', ], // Table headers
      data: filteredModules.map((module) => ({
        id: module.module_id, // Unique ID for each row
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
