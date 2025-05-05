import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import { useNavigate } from 'react-router-dom'
import Course from '../../components/CourseView/Course'

const ViewCourses = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [userData, setUserData] = useState()
  const [search, setSearch] = useState('')
  const [yearStart, setYearStart] = useState('')
  const [yearEnd, setYearEnd] = useState('')
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
      userService.getAllUserCourses(user.id, user.token)
        .then(initialUserData => {
          setUserData(initialUserData.user)
          setCourses(Array.isArray(initialUserData.user?.courses) ? initialUserData.user.courses : [])
        })
        .catch(error => {
          setCourses([]) // Prevent breaking if API fails
        })
    }
  }, [user?.id])

  if (!user?.id) return <div>loading....</div>
  if (!courses) return <div>loading... courses</div>

  // Extract unique values dynamically
  const uniqueYearsStart = [...new Set(
    courses.flatMap(course => course.course_years.map(year => year.year_start))
  )].sort()

  const uniqueYearsEnd = [...new Set(
    courses.flatMap(course => course.course_years.map(year => year.year_end))
  )].sort()

  const uniqueQualifications = [...new Set(courses.map(course => course.qualification))].sort()

  const uniqueFullTimeStatus = [...new Set(
    courses.map(course => course.part_time === 0 ? 'Full-Time' : 'Part-Time')
  )]

  // Filter courses based on selected filters
  const filteredCourses = courses.filter(course => {

    const matchesLevel = qualification ? course.qualification === qualification : true

    const matchesFullTime = fullTime
      ? (fullTime === 'Full-Time' ? course.part_time === 0 : course.part_time === 1)
      : true

    const isMatching = matchesLevel && matchesFullTime


    return isMatching
  })

  const toggleFilters = () => setShowFilters(!showFilters)

  return (
    <div className="w-auto p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        Your Courses
      </h2>

      {courses ? (
        <>
          {/* Filters Section */}
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Search & Filters</h3>
              <button
                onClick={toggleFilters}
                className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
              >
                {showFilters ? 'Hide Filters' : 'View Filters'}
              </button>
            </div>

            {/* Conditional Rendering for Filters */}
            {showFilters && (
              <>
                {/* Search Bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full text-slate-900"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Year Start Filter */}
                  <div>
                    <label className="block text-slate-900 dark:text-white mb-2">Year Start</label>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 text-slate-900"
                      value={yearStart}
                      onChange={(e) => setYearStart(e.target.value)}
                    >
                      <option value="">All Years</option>
                      {uniqueYearsStart.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year End Filter */}
                  <div>
                    <label className="block text-slate-900 dark:text-white mb-2">Year End</label>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 text-slate-900"
                      value={yearEnd}
                      onChange={(e) => setYearEnd(e.target.value)}
                    >
                      <option value="">All Years</option>
                      {uniqueYearsEnd.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Qualification Filter */}
                  <div>
                    <label className="block text-slate-900 dark:text-white mb-2">Qualification</label>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 text-slate-900"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                    >
                      <option value="">All</option>
                      {uniqueQualifications.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Full-Time / Part-Time Filter */}
                  <div>
                    <label className="block text-slate-900 dark:text-white mb-2">Full-Time/Part-Time</label>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 text-slate-900"
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
              </>
            )}
          </div>

          {/* Course List */}
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Course key={course.course_id} course={course} search={search} yearStart={yearStart} yearEnd={yearEnd}/>
            ))
          ) : (
            <p className="text-center text-slate-900 dark:text-white">No courses found.</p>
          )}
        </>
      ) : (
        <div>No courses</div>
      )}
    </div>
  )
}

export default ViewCourses
