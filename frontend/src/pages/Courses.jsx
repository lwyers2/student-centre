import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userService from '../services/user'

const Courses = () => {
  // Access the user data from the Redux store
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  console.log(user.user)

  useEffect(() => {
    if (user) {
      console.log('User data:', user)
    } else {
      console.error('User is not logged in or user ID is missing.')
    }
  }, [user])


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
