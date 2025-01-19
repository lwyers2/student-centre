import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../services/user'

const Modules = () => {
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()
  const params = useParams()

  const [course, setCourse] = useState()
  const [modules, setModules] = useState()

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])

  console.log(params)

  useEffect(() => {
    const id = user.id
    const courseYearId = params.id
    userService.getUserModulesCourseYear(id, courseYearId)
      .then(response => {
        console.log(`Module Data fetched: ${response}`)
        setModules(response)
      })
      .catch(error => {
        console.error(`Error fetching modules: ${error}`)
      })
  }, [params.id])

  console.log(modules)

  return (
    <div>
      <h1 className="text-2xl font-bold">Modules</h1>
      {/* Add meeting details or scheduling logic here */}
    </div>
  )
}

export default Modules