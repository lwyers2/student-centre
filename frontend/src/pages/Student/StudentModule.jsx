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
  useEffect(() => {
    studentService.getStudentModule(params.id, user.token, params.moduleYearId)
      .then(response => {
        setStudent(response)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])

  console.log(student)

  return(
    <div>You are at the student module page</div>
  )

}

export default StudentModule