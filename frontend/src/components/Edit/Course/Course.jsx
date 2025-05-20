import React from 'react'
import Table from '../../Table'

const Course = ({ courses, search = '',  }) => {
  // filter courses
  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(search.toLowerCase()) ||
    course.code?.toLowerCase().includes(search.toLowerCase())
  )

  const tableLabels = {
    title: 'All Courses'
  }

  const tableContent = {
    headers: ['Code', 'Title', 'Qualification', 'School', 'Schedule', 'Years'],
    data: filteredCourses.map(course => ({
      id: course.id,
      code: course.code,
      title: course.title,
      qualification: course.qualification,
      school: course.school,
      schedule: course.part_time === 0 ? 'Full-Time' : 'Part-Time',
      years: course.years,
    })),
    view: '/edit-course'
  }

  return (
    <Table
      labels={tableLabels}
      content={tableContent}
    />
  )
}

export default Course
