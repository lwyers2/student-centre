import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../../services/student.js'
import StudentCourseModulesResults from '../../components/StudentView/StudentCourseModulesResults.jsx'

const StudentCourseModules = () => {
  const params = useParams()
  const [student, setStudent] = useState(null)
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState(null)
  const [groupedModules, setGroupedModules] = useState(null)
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('All')
  const [filterResult, setFilterResult] = useState('All')
  const [showFilters, setShowFilters] = useState(true)
  const user = useSelector(state => state.user)

  useEffect(() => {
    if (params.studentId && params.courseYearId) {
      studentService.getStudentModulesFromCourseYear(params.studentId, user.token, params.courseYearId)
        .then(response => {
          setStudent(response.student)
          setCourse(response.course)
          setModules(response.modules)

          const grouped = response.modules.reduce((acc, module) => {
            const year = module.year || 'Unknown Year'

            if (!acc[year]) {
              acc[year] = []
            }

            if (!acc[year].some(existingModule => existingModule.module_year_id === module.module_year_id)) {
              acc[year].push(module)
            }

            return acc
          }, {})

          setGroupedModules(grouped)
        })
        .catch(error => {
          console.error('Error fetching module: ', error)
        })
    }
  }, [params.studentId, params.courseYearId, user.token])

  const uniqueYears = [...new Set(modules?.map(module => module.year))].sort()
  const uniqueResults = [...new Set(modules?.map(module => module.result))]

  const getFilteredModules = () => {
    let filtered = modules

    if (filterYear !== 'All') {
      filtered = filtered.filter(module => module.year === parseInt(filterYear))
    }

    if (filterResult !== 'All') {
      filtered = filtered.filter(module => module.result === filterResult)
    }

    if (search) {
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(search.toLowerCase()) ||
        module.code.toLowerCase().includes(search.toLowerCase())
      )
    }

    return filtered
  }

  const filteredModules = getFilteredModules()

  const toggleFilters = () => setShowFilters(!showFilters)

  return (
    <div className="p-2 my-4 scroll-mt-20">
      {student ? (
        <>
          <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
            {student.forename} {student.surname} ({student.code})
          </h2>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">
            {course.title} ({course.code} {course.part_time ? 'PT' : 'FY'}) {course.year_start}/{course.year_end}
          </h2>

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

            {showFilters && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full text-slate-900"
                    placeholder="Search modules..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-900 dark:text-white mb-2">Year</label>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 text-slate-900"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                    >
                      <option value="All">All Years</option>
                      {uniqueYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-900 dark:text-white mb-2">Result</label>
                    <select
                      className="border border-gray-300 rounded px-3 py-2 text-slate-900"
                      value={filterResult}
                      onChange={(e) => setFilterResult(e.target.value)}
                    >
                      <option value="All">All Results</option>
                      {uniqueResults.map(result => (
                        <option key={result} value={result}>{result}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {filteredModules.length > 0 ? (
            Object.keys(groupedModules).map((year) => (
              <StudentCourseModulesResults
                key={year}
                student={student}
                modules={filteredModules.filter(module => module.year === parseInt(year))}
                year={year}
              />
            ))
          ) : (
            <p>No modules found based on your filters.</p>
          )}
        </>
      ) : (
        <p>Loading student information...</p>
      )}
    </div>
  )
}

export default StudentCourseModules
