import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import studentService from '../../services/student'
import letterService from '../../services/letter'

const StudentModule = () => {

  const params = useParams()
  const [module, setModule] = useState(null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {
    studentService.getStudentModule(params.id, user.token, params.moduleYearId)
      .then(response => {
        setStudent(response.student)
        setModule(response.module)
        setLetter(response.letter)
        console.log(response)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])




  const handleSendLetter = async () => {
    if (!module || !user) return

    setLoading(true)
    try {
      // Send the letter
      const response = await letterService.sendLetter(student.id, module.module_year_id, user.id, user.id)


      if (response === 'Letter sent successfully, meeting scheduled if necessary') {
        // Define new letter details after sending
        const newLetter = {
          date_sent: new Date().toISOString(),
          sent_by_user: user.name,
          sent: true, // Mark the letter as sent
          authorised: false,  // Assuming initially not authorised
          authorised_by_user: null,
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
          {letter && Object.keys(letter).length > 0 ?  (
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex-1 p-2 mb-2 sm:mb-0">
                <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                  <p><strong>Letter:</strong> Sent</p>
                </div>
              </div>
              <div className="flex-1 p-2 mb-2 sm:mb-0">
                <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                  <p><strong>Letter Sent Date:</strong> {letter.date_sent || 'N/A'}</p>
                </div>
              </div>
              <div className="flex-1 p-2 mb-2 sm:mb-0">
                <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
                  <p><strong>Sent By:</strong> {letter.sent_by_user || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : null}


          {/* Send Letter Button */}
          {(!letter || Object.keys(letter).length === 0) && module.flagged && student.letter_count_for_academic_year <=1 ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              onClick={handleSendLetter}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Letter'}
            </button>
          ) : null}

          {/* Send Letter Button */}
          { student.letter_count_for_academic_year >=2 ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              onClick={handleSendLetter}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Meeting'}
            </button>
          ) : null}
        </>
      ) : (
        <div>No Module to view</div>
      )}
    </div>
  )
}

export default StudentModule
