import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import studentService from '../../services/student'

const StudentModule = () => {

  const params = useParams()
  const [module, setModule] = useState(null)
  const [student, setStudent] = useState(null)
  const user = useSelector (state => state.user)

  console.log(params)
  console.log(user.token)
  useEffect(() => {
    studentService.getStudentModule(params.id, user.token, params.moduleYearId)
      .then(response => {
        setStudent(response.student)
        setModule(response.module)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])

  console.log(student)
  console.log(module)

  return(
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {student && module ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{student.forename} {student.surname} ({student.student_code}) </h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">{module.title} ({module.code}) {module.semester} {module.year_start}</h2>
          </>
        ): (
          <p>Student or module not found</p>
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
              Module Details:
            </div>
            <div className="flex items-center justify-between mb-4">
              Result: {module.result_details.result}
            </div>
            <div className="flex items-center justify-between mb-4">
              Resit: {module.result_details.resit}
            </div>
            <div className="flex items-center justify-between mb-4">
              Flagged: {module.result_details.flagged}
            </div>
          </div>
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <div className="flex items-center justify-between mb-4">
              Letter:
            </div>
            <div className="flex items-center justify-between mb-4">
              Letter sent date:
            </div>
            <div className="flex items-center justify-between mb-4">
              Sent by:
            </div>
          </div>
        </>
      ) : (
        <div> no Module to view</div>
      )

      }
    </div>
  )

}

export default StudentModule