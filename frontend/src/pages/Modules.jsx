import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../services/user'
import CourseModule from '../components/CourseModule'

const Modules = () => {
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()
  const params = useParams()

  const [course, setCourse] = useState()
  const [modules, setModules] = useState()
  const [userData, setUserData] = useState()
  const [groupedModules, setGroupedModules] = useState({})
  const [search, setSearch] = useState('')

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const id = user.id
    const courseYearId = params.id
    userService.getUserModulesCourseYear(id, courseYearId, user.token)
      .then(response => {
        setUserData(response.user)
        setCourse(response.course)
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


  console.log(userData)

  if(!user.id) {
    return <div>loading....</div>
  }

  if(!course) {
    return <div>loading... courses</div>
  }

  if(!modules) {
    return <div>loading... modules</div>
  }


  return (
    <div className="w-auto p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{course.code}: {course.title} / {course.qualification} ({course.part_time})</h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">({course.year_start}/{course.year_end})</h2>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {course ? (
        <>
          {// Ive added the below above courses for now. I'll want to create a component that I can add states into. Will do it dynamically where it gets the years so I can add into other views.
          }
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
          {Object.entries(groupedModules).map(([year, modulesForYear]) => (
            <CourseModule
              key={year}
              modules={modulesForYear}
              year_start={course.year_start + parseInt(year) - 1}  // Calculate start year based on the module year
              year_end={course.year_start + parseInt(year)}  // Calculate end year based on the module year
              year={year}
              search={search}
            />
          ))}
        </>
      ) : (
        <div> no courses</div>
      )

      }
    </div>
  )
}

export default Modules