import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../../services/student'
import letterService from '../../services/letter'
import StudentCourse from '../../components/StudentView/StudentCourse'
import StudentLetters from '../../components/StudentView/StudentLetters'
import meetingService from '../../services/meeting'
import StudentMeetings from '../../components/StudentView/StudentMeetings'

const Student = () => {
  const params = useParams()
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState()
  const [showSection, setShowSection] = useState(true)
  const [letters, setLetters] = useState([])
  const [meetings, setMeetings] = useState([])

  const user = useSelector(state => state.user)

  const toggle = () => setShowSection(!showSection)

  useEffect(() => {
    studentService.getStudent(params.studentId, user.token)
      .then(response => {
        setStudent(response.student)
        setCourses(response.courses)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.studentId, user.token])

  useEffect(() => {
    letterService.getAllLettersForStudent(params.id)
      .then(response => {
        setLetters(response)
      })
      .catch(error => {
        console.error('Error fetching letters: ', error)
      })
  }
  , [params.id])

  useEffect(() => {
    meetingService.getAllMeetingsForStudent(params.id)
      .then(response => {
        setMeetings(response)
      })
      .catch(error => {
        console.error('Error fetching meetings: ', error)
      })
  }, [params.id])



  if(!student) {
    return <p>No student data available</p>
  }


  console.log(meetings)


  return (
    <div className="p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{student.forename} {student.surname} ({student.student_code})</h2>
      <p className="text-2xl font-bold text-center sm:text-2xl mb-6 text-slate-900 dark:text-white">{student.email}</p>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view student details.</p>
      )}
      {student ? (

        <>
          {courses.length > 0 ?
            (
              <>
                <StudentCourse courses= {courses} student = {student}/>
                <StudentLetters letters={letters} student={student} />
                <StudentMeetings meetings={meetings} student={student} />
              </>
            )
            :
            (
              <p>This student is not enrolled in any courses</p>
            )}
        </>

      ) : (
        <div> no student details</div>
      )

      }
    </div>
  )

}
export default Student

