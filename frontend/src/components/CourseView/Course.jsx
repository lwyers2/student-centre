import React from 'react'
import Table from '../Table'

const Course = ({ course, search, yearStart, yearEnd }) => {

  const courseSchedule = course.part_time === 0 ? 'FY' : 'PT'

  // First, filter course years based on the search term
  const filteredCourseYears = course.course_years?.filter((courseYear) =>
    courseYear.year_start.toString().includes(search) ||
    courseYear.year_end.toString().includes(search) ||
    courseYear.course_coordinator.toLowerCase().includes(search.toLowerCase()) ||
    course.title?.toLowerCase().includes(search.toLowerCase()) ||
    course.code?.toLowerCase().includes(search.toLowerCase())
  )

  // Now apply the year filters (start and end) on the already filtered course years
  const filteredByYear = filteredCourseYears.filter((courseYear) => {
    const matchesYearStart = yearStart ? courseYear.year_start.toString() === yearStart : true
    const matchesYearEnd = yearEnd ? courseYear.year_end.toString() === yearEnd : true
    return matchesYearStart && matchesYearEnd
  })

  // If no course years match the selected filters, return null
  if (filteredByYear.length === 0) {
    return null
  }

  // Table data for rendering
  const tableData = {
    labels: { title: `${course.title} (${course.qualification}) ${course.code}/${courseSchedule}` },
    content: {
      headers: ['Year Start', 'Year End', 'Course Co-ordinator'], // Table headers
      data: filteredByYear.map((course_year) => ({
        id: course_year.id, // Unique ID for each row
        'year start': course_year.year_start,
        'year end': course_year.year_end,
        'course co-ordinator': course_year.course_coordinator,
      })),
      view: '/course-year-modules', // Base path for "View" links
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
