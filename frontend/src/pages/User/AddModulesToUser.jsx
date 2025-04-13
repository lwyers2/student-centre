import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import moduleService from '../../services/module'

const AddModulesToUser = () => {
  const { userId } = useParams()
  const user = useSelector((state) => state.user)
  const [userData, setUserData] = useState(null)
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [selectedCourseYearId, setSelectedCourseYearId] = useState(null)
  const [availableCourses, setAvailableCourses] = useState([])
  const [availableModules, setAvailableModules] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAssigned, setShowAssigned] = useState(true)
  const [showAvailable, setShowAvailable] = useState(true)
  const [assignedModules, setAssignedModules] = useState([])

  useEffect(() => {
    userService.getUser(userId, user.token)
      .then((response) => {
        setUserData(response)
        setAssignedModules(response.modules)
        setAvailableCourses(response.courses)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }, [userId, user.token])

  const handleCourseChange = (e) => {
    const newCourseId = Number(e.target.value)
    setSelectedCourseId(newCourseId)
    setSelectedCourseYearId(null)
    setAvailableModules([])
  }

  const handleCourseYearChange = async (e) => {
    const courseYearId = Number(e.target.value)
    setSelectedCourseYearId(courseYearId)
    try {
      const modules = await moduleService.getModulesByCourseYear(user.token, courseYearId)
      const filteredModules = modules.filter(m =>
        !assignedModules.some(am => am.module_year_id === m.module_year_id)
      )
      setAvailableModules(filteredModules)
    } catch (err) {
      console.error('Failed to load modules:', err)
    }
  }

  const handleRemoveModule = (moduleYearId) => {
    const updatedModules = assignedModules.filter(m => m.module_year_id !== moduleYearId)
    setAssignedModules(updatedModules)
  }

  const selectedCourse = availableCourses.find(course => course.course_id === selectedCourseId)
  const selectedCourseYear = selectedCourse?.course_years.find(cy => cy.id === selectedCourseYearId)

  if (!userData) return <div className="text-center py-6">Loading...</div>

  return (
    <div className="container mx-auto mt-6 p-6 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Assign Modules to {userData.forename} {userData.surname}
      </h2>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Select Course</label>
        <select
          value={selectedCourseId || ''}
          onChange={handleCourseChange}
          className="w-full max-w-md p-2 border rounded dark:text-black"
        >
          <option value="" disabled>Select a course</option>
          {availableCourses.map(course => (
            <option key={course.course_id} value={course.course_id}>{course.title}</option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select Course Year</label>
          <select
            value={selectedCourseYearId || ''}
            onChange={handleCourseYearChange}
            className="w-full max-w-md p-2 border rounded dark:text-black"
          >
            <option value="" disabled>Select a course year</option>
            {selectedCourse.course_years.map(cy => (
              <option key={cy.id} value={cy.id}>
                {cy.year_start}–{cy.year_end} — {cy.course_coordinator}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCourseYear && (
        <>
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Assigned Modules</h3>
              <button
                onClick={() => setShowAssigned(prev => !prev)}
                className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {showAssigned ? 'Hide' : 'Show'}
              </button>
            </div>
            {showAssigned ? (
              <ul className="space-y-4">
                {assignedModules.map(module => (
                  <li key={module.module_year_id} className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="font-bold text-lg">{module.title} ({module.code})</p>
                    <p className="text-sm">{module.semester} {module.year_start} — {module.CATs} CATs</p>
                    <div className="mt-2">
                      <button
                        className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleRemoveModule(module.module_year_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mb-10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by module title or code..."
              className="w-full max-w-md p-2 mb-4 border rounded dark:text-black"
            />

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Available Modules</h3>
              <button
                onClick={() => setShowAvailable(prev => !prev)}
                className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {showAvailable ? 'Hide' : 'Show'}
              </button>
            </div>

            {showAvailable && (
              <ul className="space-y-4">
                {availableModules.filter(module =>
                  module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  module.code.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(module => (
                  <li key={module.module_year_id} className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="font-bold text-lg">{module.title} ({module.code})</p>
                    <p className="text-sm">{module.semester} {module.year_start} — {module.CATs} CATs</p>
                    <div className="mt-2">
                      <button
                        className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                        onClick={() => console.log(`Add module year ${module.module_year_id}`)}
                      >
                        Add
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AddModulesToUser
