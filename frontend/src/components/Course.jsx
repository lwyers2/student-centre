import React, { useState } from 'react'
import Table from './Table'

const Course = ({ course }) => {
  const modules = course.modules

  const tableData = {
    labels: { title: `${course.title} ${course.code} ${course.years} years` },
    content: {
      headers: ['Title', 'QSIS Year', 'Code', 'Cats', 'Semester'], // Table headers
      data: modules.map((module) => ({
        id: module.id, // Unique ID for each row
        title: module.title,
        'qsis year': module.QSIS_year,
        code: module.code,
        cats: module.CATs,
        semester: module.semester,
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

export default Course