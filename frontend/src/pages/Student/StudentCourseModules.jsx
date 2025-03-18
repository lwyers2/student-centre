import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../../services/student.js'

const StudentCourseModules = () => {

  const params = useParams()
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState()
  const [modules, setModules] = useState()
  const [groupedModules, setGroupedModules] = useState({})
  const [showSection, setShowSection] = useState(true)
  const user = useSelector(state => state.user)

  const toggle = () => setShowSection(!showSection)

  console.log(params)

  useEffect(() => {
    studentService.getStudent(params.id)
      .then(response => {
        setStudent(response)
        setCourses(response.courses)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])


  if(!student) {
    return <p>No student data available</p>
  }

  console.log(student)

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
                {/* <StudentCourse courses= {courses} student = {student}/> */}
                <p>Letters Sent</p>
                <p>Previous Meetings</p>
                <p>Upcoming meetings</p>
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

export default StudentCourseModules