import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import UploadRecordsModules from '../../components/UploadRecords/UploadRecordModuleYearTable'

const UploadRecordsViewModuleYears = () => {
  const user = useSelector((state) => state.user)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedCourseYearId, setSelectedCourseYearId] = useState(null)
  const [modules, setModules] = useState([])
  const [groupedModules, setGroupedModules] = useState({})
  const [searchModule, setSearchModule] = useState('') // Search state for module search term


  // Fetch courses on mount
  useEffect(() => {
    if (user.id && user.token) {
      userService
        .getAllUserCourses(user.id, user.token)
        .then((response) => {
          setCourses(response.user.courses)
        })
        .catch((error) => {
          console.error('Error fetching courses: ', error)
        })
    }
  }, [user.id, user.token])

  // Fetch modules when course year is selected
  useEffect(() => {
    if (user.id && selectedCourseYearId) {
      userService
        .getUserModulesCourseYear(user.id, selectedCourseYearId, user.token)
        .then((response) => {
          setModules(response.modules)

          const grouped = response.modules.reduce((acc, module) => {
            acc[module.year] = acc[module.year] || []
            acc[module.year].push(module)
            return acc
          }, {})

          setGroupedModules(grouped)
        })
        .catch((error) => {
          console.error(`Error fetching modules: ${error}`)
        })
    }
  }, [user.id, selectedCourseYearId])

  // Handle course selection change
  const handleCourseChange = (e) => {
    const selected = courses.find(course => course.course_id === Number(e.target.value))
    setSelectedCourse(selected)
    setSelectedYear(null)  // Reset year when course changes
    setSelectedCourseYearId(null)  // Reset courseYearId when course changes
  }

  // Handle year selection change
  const handleYearChange = (e) => {
    const selectedYearData = selectedCourse.course_years.find(year => year.id === Number(e.target.value))
    if (selectedYearData) {
      setSelectedYear(selectedYearData)
      setSelectedCourseYearId(selectedYearData.id)
    }
  }


  return (
    <div className="p-6 my-6">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        Upload Results
      </h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">
        Select Course then Module Below
      </h2>

      {/* Course & Year Selection Box */}
      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mb-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Course Selection */}
          <div className="flex-1">
            <label className="block text-slate-900 dark:text-white mb-2">Select Course:</label>
            <select
              className="p-2 border rounded w-full text-slate-900"
              onChange={handleCourseChange}
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title} ({course.code} {course.part_time ? 'PT' : 'FY'})
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          {selectedCourse && (
            <div className="flex-1">
              <label className="block text-slate-900 dark:text-white mb-2">Select Course Year:</label>
              <select
                className="p-2 border rounded w-full text-slate-900"
                onChange={handleYearChange}
              >
                <option value="">-- Select a Year --</option>
                {selectedCourse.course_years.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_start} - {year.year_end}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar for Modules */}
      {selectedCourse && selectedYear && (
        <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mb-5">
          <label className="block text-slate-900 dark:text-white mb-2">Search for a Module:</label>
          <input
            type="text"
            className="p-2 border rounded w-full text-slate-900"
            placeholder="Search modules..."
            value={searchModule}
            onChange={(e) => setSearchModule(e.target.value)}
          />
        </div>
      )}

      {/* Display Modules */}
      {Object.keys(groupedModules).length > 0 ? (
        <>
          {Object.keys(groupedModules).map((year) => (
            <UploadRecordsModules
              key={year}
              modules={groupedModules[year]}
              year_start={selectedYear.year_start}
              year_end={selectedYear.year_end}
              year={year}
              search={searchModule}
            />
          ))}
        </>
      ) : (
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          No modules found for this course year.
        </p>
      )}
    </div>
  )
}

export default UploadRecordsViewModuleYears
