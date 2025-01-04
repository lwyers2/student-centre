import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../services/student'
import Table from '../components/Table'

const Student = () => {
  const params = useParams()
  const [student, setStudent] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {
    studentService.getStudent(params.id)
      .then(response => {
        setStudent(response)
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
    <div>Student info</div>
  )

}
export default Student

