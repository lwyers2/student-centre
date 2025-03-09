import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../services/user'
import CourseModule from '../components/CourseModule'

const Modules = () => {
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()
  const params = useParams()

  const [courses, setCourses] = useState()
  const [modules, setModules] = useState()
  const [userData, setUserData] = useState()
  const [groupedModules, setGroupedModules] = useState({})

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const id = user.id
    userService.getUserModules(id,  user.token)
      .then(response => {
        setUserData(response.user)
        setCourses(response.courses)
        setModules(response.modules)
        const grouped = response.modules.reduce((acc, module) => {
          acc[module.year] = acc[module.year] || []
          acc[module.year].push(module)
          return acc
        }, {})
        setGroupedModules(grouped)

      })
      .catch(error => {
        console.error(`Error fetching modules: ${error}`)
      })
  }, [params.id])


  if(!user.id) {
    return <div>loading....</div>
  }

  if(!courses) {
    return <div>loading... courses</div>
  }

  if(!modules) {
    return <div>loading... modules</div>
  }


  return (
    <div className="w-auto p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">View All Modules</h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">{userData.prefix}. {userData.forename} {userData.surname}</h2>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className= "text-3xl font-bold text-left  mb-6 text-slate-900 dark:text-white">Search</h3>
              <button className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">View</button>
            </div>
            <div className="mb-4">
              <input className="" type="text" />
            </div>
          </div>
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className= "text-3xl font-bold text-left  mb-6 text-slate-900 dark:text-white">Filters</h3>
              <button className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">View</button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              Academic Year
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              CATS
              </button>
              <button
                onClick="filter"
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
              Semester
              </button>
            </div>
          </div>
          {/* {modules.map((module) => (
            <CourseModule
              key={module.module_year_id}
              modules={module.modulesForYear}
              year_start={courses[0].year_start + parseInt(module.year) - 1}  // Calculate start year based on the module year
              year_end={courses[0].year_start + parseInt(module.year)}  // Calculate end year based on the module year
              year={module.year}
            />
          ))} */}
        </>
      ) : (
        <div> no courses</div>
      )

      }
    </div>
  )
}

export default Modules