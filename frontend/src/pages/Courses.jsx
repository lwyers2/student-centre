import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../services/user'
import { useNavigate } from 'react-router-dom'
import Course from '../components/Course'

const Courses = () => {
  // Access the user data from the Redux store
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [userData, setUserData] = useState()
  const [search, setSearch] = useState('')



  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])


  useEffect(() => {
    if (user?.id) {
      userService.getAllUserCourses(user.id, user.token)
        .then(initialUserData => {
          setUserData(initialUserData.user)
          setCourses(Array.isArray(initialUserData.user?.courses) ? initialUserData.user.courses : []) // Ensure it's an array
        })
        .catch(error => {
          setCourses([]) // Prevent breaking if API fails
        })
    }
  }, [user?.id])



  if(!user.id) {
    return <div>loading....</div>
  }

  if(!courses) {
    return <div>loading... courses</div>
  }

  // const filteredCourses = courses?.filter(course =>
  //   // Search by title or code
  // //   course.title?.toLowerCase().includes(search.toLowerCase()) ||
  // //   course.code?.toLowerCase().includes(search.toLowerCase())
  //  ) || []

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
          {/* <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className= "text-3xl font-bold text-left  mb-6 text-slate-900 dark:text-white">Filters</h3>
              <button className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">View</button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              Date
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              Level
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              FT/PT
              </button>
            </div>
          </div> */}
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className= "text-3xl font-bold text-left  mb-6 text-slate-900 dark:text-white">Search</h3>
              <button className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">View</button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-full text-slate-900"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {courses.map(course => (
            <Course key={course.course_id} course={course} search={search}/>
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
