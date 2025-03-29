import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import studentService from '../../services/student'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import { useNavigate } from 'react-router-dom'

const ScheduleMeeting = () => {

  const params = useParams()
  const [module, setModule] = useState(null)
  const [student, setStudent] = useState(null)
  const user = useSelector(state => state.user)
  const [course, setCourse] = useState(null)

  useEffect(() => {
    studentService.getStudentModule(params.id, user.token, params.moduleYearId)
      .then(response => {
        setStudent(response.student)
        setModule(response.module)
        setCourse(response.course)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])

  console.log(student)
  console.log(module)


  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {student && module && course ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
              Schedule Meeting
            </h2>
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

      {module && student && course ? (
        <>
          {(module.semester === 'Autumn' || module.semester === 'Full Year') ?

            (<h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">Academic Year: {module.year_start}/{module.year_start + 1}</h2>)
            :
            (<h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">Academic Year: {module.year_start - 1}/{module.year_start}</h2>)

          }
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4  text-center">
                <p><strong>Student:</strong> {student.forename} {student.surname} ({student.student_code}) </p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4 text-center">
                <p><strong>Course:</strong> {course.title}</p>
              </div>
            </div>
          </div>
          {/* Module Details Box */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4  text-center">
                <p><strong>Select Admin User for Meeting:</strong></p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4 text-center">
                <p><strong>Select Teaching Staff for Meeting:</strong></p>
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

export default ScheduleMeeting