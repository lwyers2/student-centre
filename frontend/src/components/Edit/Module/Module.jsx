import React from 'react'
import Table from '../../Table'

const Module = ({ modules }) => {

  // Prepare table content
  const tableLabels = {
    title: 'All Modules'
  }

  const tableContent = {
    headers: ['Code', 'Title', 'CATs', 'Year'],
    data: modules.map(module => ({
      id: module.id, // unique ID
      code: module.code,
      title: module.title,
      cats: module.CATs,
      year: module.year,
    })),
    view: '/edit-module',
  }

  return (
    <Table
      labels={tableLabels}
      content={tableContent}
    />
  )
}

export default Module
