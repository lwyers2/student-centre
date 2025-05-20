import React, { useState } from 'react'
import Table from '../Table'

const StudentCourse = ({ courses, student }) => {



  const getFlagCount = (course) => {
    let flagCount = 0

    course.modules.map((module) => {
      if (module.flagged === 1) {
        flagCount++
      }
    })
    return flagCount
  }


  const tableData = {
    labels: { title: 'View module results for Active Courses' },
    content: {
      headers: ['title', 'flags' ],
      data: courses.map((course) => ({
        id: course.course_year_id,
        title : course.title,
        flags: getFlagCount(course)
      })),
      view: `/student/${student.id}/course`,
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