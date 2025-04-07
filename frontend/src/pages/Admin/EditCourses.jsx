// EditCourses.jsx
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import { useNavigate } from 'react-router-dom'
import Course from '../../components/Edit/Course/Course'
import courseService from '../../services/course'

const EditCourses = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [userData, setUserData] = useState()
  const [search, setSearch] = useState('')
  const [school, setSchool] = useState('')
  const [qualification, setQualification] = useState('')
  const [fullTime, setFullTime] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (user?.id) {
      courseService.getAll(user.token)
        .then(courses => {
          setCourses(courses)
        })
        .catch(error => {
          setCourses([]) // Prevent breaking if API fails
        })
    }
  }, [user?.id])

  if (!user?.id) return <div>loading....</div>
  if (!courses) return <div>loading... courses</div>


  const uniqueQualifications = [...new Set(courses.map(course => course.qualification))].sort()

  const uniqueSchools = [...new Set(courses.map(course => course.school))].sort()

  const uniqueFullTimeStatus = [...new Set(
    courses.map(course => course.part_time === 0 ? 'Full-Time' : 'Part-Time')
  )]

  // Filter courses based on selected filters
  const filteredCourses = courses.filter(course => {

    const matchesLevel = qualification ? course.qualification === qualification : true

    const matchesFullTime = fullTime
      ? (fullTime === 'Full-Time' ? course.part_time === 0 : course.part_time === 1)
      : true

    const matchesSchool = school ? course.school === school : true

    const isMatching = matchesLevel && matchesFullTime && matchesSchool


    return isMatching
  })

  const toggleFilters = () => setShowFilters(!showFilters)


  return (<div className="w-auto p-2 my-6 scroll-mt-20">
    <h2 className="text-4xl font-bold text-center sm:text-5xl mb-8 text-slate-900 dark:text-white">
      Find Course to Edit
    </h2>

    {courses ? (
      <>
        {/* Filters Section */}
        <div className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-md mb-10 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-0">Search & Filters</h3>
            <button
              onClick={toggleFilters}
              className="bg-slate-600 hover:bg-slate-500 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              {showFilters ? 'Hide Filters' : 'View Filters'}
            </button>
          </div>

          {/* Filters Block */}
          {showFilters && (
            <div className="animate-fade-in">
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-slate-900"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Qualification */}
                <div>
                  <label className="block text-slate-900 dark:text-white mb-1">Qualification</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                  >
                    <option value="">All</option>
                    {uniqueQualifications.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* School */}
                <div>
                  <label className="block text-slate-900 dark:text-white mb-1">School</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  >
                    <option value="">All</option>
                    {uniqueSchools.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>

                {/* Full-Time/Part-Time */}
                <div>
                  <label className="block text-slate-900 dark:text-white mb-1">Full-Time/Part-Time</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900"
                    value={fullTime}
                    onChange={(e) => setFullTime(e.target.value)}
                  >
                    <option value="">Both</option>
                    {uniqueFullTimeStatus.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {filteredCourses.length > 0 ? (
            <Course courses={filteredCourses} search={search} />
          ) : (
            <p className="text-center text-slate-900 dark:text-white">No courses found.</p>
          )}
        </div>
      </>
    ) : (
      <div>No courses</div>
    )}
  </div>

  )
}

export default EditCourses
