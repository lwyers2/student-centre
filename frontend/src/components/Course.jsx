import React, { useState } from 'react'
import Table from './Table'

const Course = ({ course, search }) => {

  const courseSchedule = course.part_time === 0 ? 'FY' : 'PT'

  const filteredCourseYears = course.course_years?.filter((courseYear) =>
    courseYear.year_start.toString().includes(search) ||
    courseYear.year_end.toString().includes(search) ||
    courseYear.course_coordinator.toLowerCase().includes(search.toLowerCase()) ||
    course.title?.toLowerCase().includes(search.toLowerCase()) ||
    course.code?.toLowerCase().includes(search.toLowerCase())
  )

  console.log(filteredCourseYears)


  const tableData = {
    labels: { title: `${course.title} (${course.qualification}) ${course.code}/${courseSchedule}` },
    content: {
      headers: ['Year Start', 'Year End', 'Course Co-ordinator'], // Table headers
      data: filteredCourseYears.map((course_year) => ({
        id: course_year.id, // Unique ID for each row
        'year start': course_year.year_start,
        'year end': course_year.year_end,
        'course co-ordinator': course_year.course_coordinator,
      })),
      view: '/modules', // Base path for "View" links
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