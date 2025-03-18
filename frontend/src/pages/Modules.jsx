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
  const [academicYear, setAcademicYear] = useState('')
  const [semester, setSemester] = useState('')
  const [cats, setCats] = useState('')
  const [coordinator, setCoordinator] = useState('')
  const [showFilters, setShowFilters] = useState(true)

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


  console.log(modules)

  if (!user.id || !course || !modules) {
    return <div>Loading...</div>
  }

  // Extract unique values for filtering
  const uniqueAcademicYears = [...new Set(modules.map(module => module.year))].sort()
  const uniqueSemesters = [...new Set(modules.map(module => module.semester))].sort()
  const uniqueCATS = [...new Set(modules.map(module => module.CATs))].sort()
  const uniqueCoordinators = [...new Set(modules.map(module => module.module_coordinator))].sort()

  // Filter logic
  const filteredModules = modules.filter(module => {
    const matchesSearch = search ? module.title.toLowerCase().includes(search.toLowerCase()) : true
    const matchesYear = academicYear ? module.year === parseInt(academicYear) : true
    return matchesSearch && matchesYear
  })


  // Regroup filtered modules
  const regroupedModules = filteredModules.reduce((acc, module) => {
    acc[module.year] = acc[module.year] || []
    acc[module.year].push(module)
    return acc
  }, {})

  return (
    <div className="w-auto p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        {course.code}: {course.title} / {course.qualification} ({course.part_time === 0 ? 'FY' : 'PT'})
      </h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">
        ({course.year_start}/{course.year_end})
      </h2>

      {/* Search & Filter Section */}
      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-3xl font-bold text-left mb-6 text-slate-900 dark:text-white">Search & Filters</h3>
          <button
            className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'View Filters'}
          </button>
        </div>

        {/* Conditional rendering of filters */}
        {showFilters && (
          <>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full text-slate-900"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Academic Year Filter */}
              <div>
                <label className="block text-slate-900 dark:text-white mb-2">Academic Year</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-slate-900 w-full"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueAcademicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div>
                <label className="block text-slate-900 dark:text-white mb-2">Semester</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-slate-900 w-full"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueSemesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              {/* CATS Filter */}
              <div>
                <label className="block text-slate-900 dark:text-white mb-2">CATS</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-slate-900 w-full"
                  value={cats}
                  onChange={(e) => setCats(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueCATS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Module Coordinator Filter */}
              <div>
                <label className="block text-slate-900 dark:text-white mb-2">Module Coordinator</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-slate-900 w-full"
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueCoordinators.map(coord => (
                    <option key={coord} value={coord}>{coord}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
      {Object.entries(regroupedModules).map(([year, modulesForYear]) => (
        <CourseModule
          key={year}
          modules={modulesForYear}
          year_start={course.year_start + parseInt(year) - 1}  // Calculate start year based on the module year
          year_end={course.year_start + parseInt(year)}  // Calculate end year based on the module year
          year={year}
          search={search}
          semester={semester}
          coordinator={coordinator}
          cats={cats}
        />
      ))}
    </div>
  )
}

export default Modules