import React, { useState } from 'react'
import Table from './Table'

const Course = ({ course }) => {
  const course_years = course.course_years

  const courseSchedule = course.part_time === 0 ? 'FY' : 'PT'


  const tableData = {
    labels: { title: `${course.title} (${course.qualification_level.qualification}) ${course.code}/${courseSchedule}` },
    content: {
      headers: ['year_start', 'year_end', 'course_co-ordinator'], // Table headers
      data: course_years.map((course_year) => ({
        id: course_year.id, // Unique ID for each row
        year_start: course_year.year_start,
        year_end: course_year.year_end,
        'course_co-ordinator': course_year['course_co-ordinator'].forename + ' ' + course_year['course_co-ordinator'].surname,
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