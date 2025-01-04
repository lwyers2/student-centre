import React, { useState } from 'react'
import Table from './Table'

const Course = ({ course }) => {
  const modules = course.modules

  const tableData = {
    labels: { title: `${course.title} ${course.code} ${course.years} years` },
    content: {
      headers: ['Title', 'qsis_year', 'Code', 'CATs', 'Semester'], // Table headers
      data: modules.map((module) => ({
        id: module.id, // Unique ID for each row
        title: module.title,
        'qsis_year': module.qsis_year,
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