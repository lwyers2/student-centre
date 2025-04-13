import React from 'react'
import Table from '../Table'
import { format } from 'date-fns'

const StudentLetters = ({ letters, student }) => {
  if (!letters || letters.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No letters issued for this student.</p>
  }

  const formattedData = letters.map(letter => ({
    type: letter.type,
    date: format(new Date(letter.date_sent), 'dd MMM yyyy'),
    module: `${letter.module?.code} – ${letter.module?.title}`,
    'academic year': letter.module?.year,
    'sent by': letter.sent_by,
    id: letter.id,
    view: `/student/${student.id}/module-year/${letter.module.module_year_id}`, // ✅ View path
  }))

  const labels = {
    title: 'Letters Issued',
  }

  const content = {
    headers: ['Type', 'Date', 'Module', 'Academic Year', 'Sent By'],
    data: formattedData,
    view: (row) => row.view, // ✅ Let Table render the "View" button with the right path
  }

  return <Table labels={labels} content={content} />
}

export default StudentLetters
