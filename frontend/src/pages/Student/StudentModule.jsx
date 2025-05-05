import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import studentService from '../../services/student'
import letterService from '../../services/letter'
import { Link } from 'react-router-dom'

const StudentModule = () => {

  const params = useParams()
  const [module, setModule] = useState(null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {
    studentService.getStudentModule(params.studentId, user.token, params.moduleYearId)
      .then(response => {
        setStudent(response.student)
        setModule(response.module)
        setLetter(response.letter)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.studentId, params.moduleYearId, user.token])




  const handleSendLetter = async () => {
    if (!module || !user) return

    setLoading(true)
    try {
      // Send the letter
      const response = await letterService.sendLetter(student.id, module.module_year_id, user.id, user.id)


      const letterType = student.letter_count_for_academic_year === 0 ? '1st Warning' : '2nd Warning'

      if (response === 'Letter sent successfully, meeting scheduled if necessary') {
        // Define new letter details after sending
        const newLetter = {
          date_sent: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }),
          sent_by_user: `${user.prefix}. ${user.forename} ${user.surname}`,
          sent: true, // Mark the letter as sent
          authorised: false,  // Assuming initially not authorised
          authorised_by_user: null,
          title: letterType,
        }

        // Update the letter state
        setLetter(newLetter)

        // Update the module state to reflect the new letter sent
        setModule(prevModule => ({
          ...prevModule,
        }))

        setStudent(prevStudent => ({
          ...prevStudent,
          letter_count_for_academic_year: prevStudent.letter_count_for_academic_year + 1
        }))

      } else {
        alert('Failed to send letter')
      }
    } catch (error) {
      console.error('Error sending letter:', error)
      alert('Error sending letter')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {student && module ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
              <Link
                to={`/student/${student.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                {student.forename} {student.surname} ({student.student_code})
              </Link>
            </h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">{module.title} ({module.code}) {module.semester}</h2>
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
          {(module.semester === 'Autumn' || module.semester === 'Full Year') ?

            (<h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">Academic Year: {module.year_start}/{module.year_start + 1}</h2>)
            :
            (<h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">Academic Year: {module.year_start - 1}/{module.year_start}</h2>)

          }
          <div className="flex-1 p-2 mb-2 sm:mb-0 flex justify-center items-center">
            <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4 w-1/2 text-center">
              <p><strong>Letters sent for academic year:</strong> {student.letter_count_for_academic_year }</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white"></h2>
          {/* Module Details Box */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4  text-center">
                <p><strong>Result:</strong> {module.result}{module.result_descriptor}</p>
              </div>
            </div>
            <div className="flex-1 p-2 mb-2 sm:mb-0">
              <div className="border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4 text-center">
                <p><strong>Resit:</strong> {module.resit ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Letter Details Box */}
          {letter && Object.keys(letter).length > 0 ?  (
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex-1 p-2 mb-2 sm:mb-0">
                <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-center">
                  <p><strong>Letter Sent </strong></p>
                  <p><strong>Letter Type: </strong> {letter.title}</p>
                  <p><strong>Sent By:</strong> {letter.sent_by_user || 'N/A'}</p>
                  <p><strong>Letter Sent Date:</strong> {letter.date_sent || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : null}


          {/* Send Letter Button */}
          {(!letter || Object.keys(letter).length === 0) && module.flagged && student.letter_count_for_academic_year <=1 ? (
            <>
              <div className="flex flex-wrap justify-center items-center mb-4">
                <div className="w-1/2 p-2">
                  <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-center">
                    <p><strong>{student.forename} {student.surname} has not met the minimum requirements for this module.</strong></p>
                    <p>Send Letter to student for this module</p>
                    <br />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                      onClick={handleSendLetter}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Letter'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* Schedule meeting */}
          {student.letter_count_for_academic_year >= 2 ? (
            <div className="flex flex-wrap justify-center items-center mb-4">
              <div className="w-1/2 p-2"> {/* This makes it half-width */}
                <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-center">
                  <p>
                    <strong>
            There have been {student.letter_count_for_academic_year} letters sent for this academic year.
                    </strong>
                  </p>
                  <p>
                    <Link
                      to={`/schedule-meeting/${student.id}/module-year/${module.module_year_id}`} // Use href="/schedule-meeting" if using Next.js
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
            Click here to schedule a meeting for this student
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div>No Module to view</div>
      )}
    </div>
  )
}

export default StudentModule
