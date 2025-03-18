import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../../services/student.js'

const StudentCourseModules = () => {

  const params = useParams()
  const [student, setStudent] = useState(null)
  const [course, setCourse] = useState()
  const [modules, setModules] = useState()
  const [groupedModules, setGroupedModules] = useState({})
  const [showSection, setShowSection] = useState(true)
  const user = useSelector(state => state.user)

  const toggle = () => setShowSection(!showSection)

  console.log(params)

  useEffect(() => {
    studentService.getStudentModulesFromCourseYear(params.id, user.token, params.courseYearId)
      .then(response => {
        setCourse(response[0])
        setModules(response[0].modules)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])

  console.log(course)
  console.log(modules)

  return (

    <div className="p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{student.forename} {student.surname} ({student.student_code})</h2>
      <p className="text-2xl font-bold text-center sm:text-2xl mb-6 text-slate-900 dark:text-white">{student.email}</p>
    </div>
  )
}

export default StudentCourseModules