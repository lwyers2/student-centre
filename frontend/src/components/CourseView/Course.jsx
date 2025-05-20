import React from 'react'
import Table from '../Table'

const Course = ({ course, search, yearStart, yearEnd }) => {

  const courseSchedule = course.part_time === 0 ? 'FY' : 'PT'

  // filter course years based on the search term
  const filteredCourseYears = course.course_years?.filter((courseYear) =>
    courseYear.year_start.toString().includes(search) ||
    courseYear.year_end.toString().includes(search) ||
    courseYear.course_coordinator.toLowerCase().includes(search.toLowerCase()) ||
    course.title?.toLowerCase().includes(search.toLowerCase()) ||
    course.code?.toLowerCase().includes(search.toLowerCase())
  )

  // year filters
  const filteredByYear = filteredCourseYears.filter((courseYear) => {
    const matchesYearStart = yearStart ? courseYear.year_start.toString() === yearStart : true
    const matchesYearEnd = yearEnd ? courseYear.year_end.toString() === yearEnd : true
    return matchesYearStart && matchesYearEnd
  })

  if (filteredByYear.length === 0) {
    return null
  }

  const tableData = {
    labels: { title: `${course.title} (${course.qualification}) ${course.code}/${courseSchedule}` },
    content: {
      headers: ['Year Start', 'Year End', 'Course Co-ordinator'],
      data: filteredByYear.map((course_year) => ({
        id: course_year.id,
        'year start': course_year.year_start,
        'year end': course_year.year_end,
        'course co-ordinator': course_year.course_coordinator,
      })),
      view: '/course-year-modules',
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
