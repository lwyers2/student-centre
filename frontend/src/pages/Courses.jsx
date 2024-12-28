import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../services/user'
import { useNavigate } from 'react-router-dom'
import Course from '../components/Course'

const Courses = () => {
  // Access the user data from the Redux store
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()

  const [courses, setCourses] = useState()

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const id = user.id
    userService.getUser(id)
      .then(initialUserData => {
        setCourses(initialUserData.courses)
      })
  }, [user.id])



  if(!user.id) {
    return <div>loading....</div>
  }

  if(!courses) {
    return <div>loading... courses</div>
  }

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Your Courses</h2>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {courses ? (
        <>
          {courses.map(course => (
            <Course key={course.title} course={course}/>
          ))}
        </>
      ) : (
        <div> no courses</div>
      )

      }
    </div>
  )
}

export default Courses
