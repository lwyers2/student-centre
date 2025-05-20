import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moduleService from '../../services/module'
import Table from '../../components/Table'

const ModuleYearStudent = () => {
  const params = useParams()
  const [module, setModule] = useState(null)
  const [students, setStudents] = useState(null)
  const user = useSelector(state => state.user)
  const [search, setSearch] = useState('')

  useEffect(() => {
    moduleService.getModuleFromModuleYear(params.moduleYearId, user.token)
      .then(response => {
        setModule(response.module[0])
        setStudents(response.module[0].students)
      })
      .catch(error => {
        console.error('Error fetching module:', error)
      })
  }, [params.moduleYearId, user.token])


  if (!module) {
    return <p>No module data available</p>
  }

  if(!students) {
    return <p>No student data available</p>
  }

  const filteredStudents = students.filter((student) =>
    student.forename.toLowerCase().includes(search.toLowerCase()) ||
    student.surname.toLowerCase().includes(search.toLowerCase()) ||
    student.student_code.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  )

  const tableData = {
    labels: { title: 'Students' },
    content: {
      headers: [ 'Student Code', 'Forename', 'Surname', 'Email', 'Result'],
      data: filteredStudents.map((student) => ({
        id: student.id,
        email: student.email,
        'student code': student.student_code,
        forename: student.forename,
        surname: student.surname,
        result: student.result,
      })),
      view: (row) => `/student/${row.id}/module-year/${module.module_year_id}`
    },
  }

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {module ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{module.title} </h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">({module.code}) {module.semester} {module.year_start}</h2>
          </>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className= "text-3xl font-bold text-left  mb-6 text-slate-900 dark:text-white">Search</h3>
              <button className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">View</button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-full text-slate-900"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Table
            labels={tableData.labels}
            content={tableData.content}
          />
        </>
      ) : (
        <div> no students</div>
      )

      }
    </div>
  )
}

export default ModuleYearStudent
