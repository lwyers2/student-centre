import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../services/module'
import Table from '../components/Table'

const Student = () => {
  const params = useParams()
  const [student, setStudent] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {
    studentService.
  })
}