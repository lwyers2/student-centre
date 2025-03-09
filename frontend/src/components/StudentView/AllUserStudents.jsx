import React, { useState } from 'react'
import Table from '../Table'

const AllUserStudents = ({ students }) => {



  const tableData = {
    labels: { title: 'Showing students from your assigned modules' },
    content: {
      headers: ['Forename', 'Surname', 'Student Code', 'Email' ], // Table headers
      data: students.map((student) => ({
        id: student.id, // Unique ID for each row
        forename : student.forename,
        surname: student.surname,
        'student code': student.student_code,
        email: student.email,
      })),
      view: '/student', // Base path for "View" links
    },
  }

  return (

    <Table
      labels={tableData.labels}
      content={tableData.content}
    />
  )
}

export default AllUserStudents