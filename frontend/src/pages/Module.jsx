import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moduleService from '../services/module'
import Table from '../components/Table'

const Module = () => {
  const params = useParams()
  const [module, setModule] = useState(null)
  const [students, setStudents] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {
    moduleService.getModule(params.id)
      .then(response => {
        console.log('Module data fetched:', response)
        setModule(response)
        setStudents(response.Students)
      })
      .catch(error => {
        console.error('Error fetching module:', error)
      })
  }, [params.id])



  if (!module) {
    return <p>No module data available</p> // Handle no module found
  }

  if(!students) {
    return <p>No student data available</p> // Handle no module found
  }

  const tableData = {
    labels: { title: `${module.title} ${module.code}` },
    content: {
      headers: [ 'student_code', 'email', 'forename', 'surname','result'], // Table headers
      data: students.map((student) => ({
        id: student.id, // Unique ID for each row
        student_code: student.student_code,
        email: student.email,
        forename: student.forename,
        surname: student.surname,
        result: student.student_module.result,
      })),
      view: '/student', // Base path for "View" links
    },
  }

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Your Courses</h2>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {module ? (
        <>
          <Table
            labels={tableData.labels}
            content={tableData.content}
          />
        </>
      ) : (
        <div> no courses</div>
      )

      }
    </div>
  )
}

export default Module
