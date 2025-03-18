import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import studentService from '../../services/student'

const StudentModule = () => {

  const params = useParams()
  const [module, setModule] = useState(null)
  const [student, setStudent] = useState(null)
  const user = useSelector(state => state.user)

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

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {student && module ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{student.forename} {student.surname} ({student.student_code}) </h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">{module.title} ({module.code}) {module.semester} {module.year_start}</h2>
          </>
        ) : (
          <p>Student or module not found</p>
        )}
      </div>

      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}

      {module ? (
        <>
          {/* Module Details Box */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                <p><strong>Result:</strong> {module.result}</p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                <p><strong>Resit:</strong> {module.resit ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                <p><strong>Flagged:</strong> {module.flagged ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Letter Details Box */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                <p><strong>Letter:</strong> {module.letter ? 'Sent' : 'Not Sent'}</p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                <p><strong>Letter Sent Date:</strong> {module.letter_sent_date || 'N/A'}</p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                <p><strong>Sent By:</strong> {module.sent_by || 'N/A'}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>No Module to view</div>
      )}
    </div>
  )
}

export default StudentModule
