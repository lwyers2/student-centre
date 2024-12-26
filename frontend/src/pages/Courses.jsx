import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userService from '../services/user'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
  // Access the user data from the Redux store
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])


  return (
    <div>
      <h1>Your Courses</h1>
      {user ? (
        <div>
          <p>User ID: {user.id}</p>
          <p>User Name: {user.forename} {user.surname}</p>
        </div>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
    </div>
  )
}

export default Courses
