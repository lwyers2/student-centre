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
    moduleService.getModuleFromModuleYear(params.id)
      .then(response => {
        console.log('Module data fetched:', response)
        setModule(response.module)
        setStudents(response.students)
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
    labels: { title: 'Students' },
    content: {
      headers: [ 'student_code', 'forename', 'surname', 'email', 'result'], // Table headers
      data: students.map((student) => ({
        id: student.id, // Unique ID for each row
        email: student.email,
        student_code: student.student_code,
        forename: student.forename,
        surname: student.surname,
        result: student.exam_results.result,
      })),
      view: '/student', // Base path for "View" links
    },
  }

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {module ? (
          <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{module.title} ({module.code}) {module.year_start}</h2>
        ): (
          <p>Module not found</p>
        )
        }
      </div>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {module ? (
        <>
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <h3>filter</h3>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2024/2025
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2026/2027
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2027/2028
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2028/2029
              </button>
            </div>
          </div>
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
