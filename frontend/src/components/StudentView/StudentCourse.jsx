import React, { useState } from 'react'
import Table from '../Table'

const StudentCourse = ({ courses }) => {


  const getFlagCount = (course) => {
    let flagCount = 0

    course.module_years.forEach((moduleYear) => {
      moduleYear.modules.forEach((module) => {
        if (module.student_module.flagged === 1) {
          flagCount++
        }
      })
    })

    return flagCount
  }


  const tableData = {
    labels: { title: 'View module results for Active Courses' },
    content: {
      headers: ['title', 'flags' ], // Table headers
      data: courses.map((course) => ({
        id: course.course_year_id, // Unique ID for each row
        title : course.title,
        flags: getFlagCount(course)
      })),
      view: '/student-modules', // Base path for "View" links
    },
  }

  return (

    <Table
      labels={tableData.labels}
      content={tableData.content}
    />
  )
}

export default StudentCourse