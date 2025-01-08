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
    <div className="w-auto p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Your Courses</h2>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {courses ? (
        <>
          {// Ive added the below above courses for now. I'll want to create a component that I can add states into. Will do it dynamically where it gets the years so I can add into other views.
          }
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <h3>filter</h3>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2024/2025
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2026/2027
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2027/2028
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              2028/2029
              </button>
            </div>
          </div>
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
