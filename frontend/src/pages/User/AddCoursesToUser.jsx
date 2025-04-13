import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import courseService from '../../services/course'

const AddCoursesToUser = () => {
  const { userId } = useParams()
  const user = useSelector((state) => state.user)
  const [userData, setUserData] = useState(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState(null)
  const [availableCourses, setAvailableCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAssigned, setShowAssigned] = useState(true)
  const [showAvailable, setShowAvailable] = useState(true)

  useEffect(() => {
    userService.getUser(userId, user.token)
      .then((response) => {
        setUserData(response)

        if (response.schools.length === 1) {
          const schoolId = response.schools[0].school_id
          setSelectedSchoolId(schoolId)
          fetchCoursesForSchool(schoolId)
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }, [userId, user.token])

  const fetchCoursesForSchool = async (schoolId) => {
    try {
      const courses = await courseService.getCoursesFromSchool(user.token, schoolId)
      setAvailableCourses(courses)
    } catch (err) {
      console.error('Failed to load courses:', err)
    }
  }

  const handleSchoolChange = (e) => {
    const newSchoolId = Number(e.target.value)
    setSelectedSchoolId(newSchoolId)
    fetchCoursesForSchool(newSchoolId)
  }

  const isCourseYearAssigned = (courseYearId) => {
    return userData?.courses?.some((course) =>
      course.course_years.some((cy) => cy.id === courseYearId)
    )
  }

  const handleRemoveCourseYear = (courseYearId) => {
    console.log(`Remove course year ID: ${courseYearId}`)
    // Logic for removing the course year goes here
  }

  const handleAddCourseYear = (courseYearId) => {
    console.log(`Add course year ID: ${courseYearId}`)
    // Logic for adding the course year goes here
  }

  const filteredAvailableCourses = availableCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!userData) return <div className="text-center py-6">Loading...</div>

  return (
    <div className="container mx-auto mt-6 p-6 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Assign Course Years to {userData.forename} {userData.surname}
      </h2>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Select School</label>
        <select
          value={selectedSchoolId || ''}
          onChange={handleSchoolChange}
          className="w-full max-w-md p-2 border rounded dark:text-black"
        >
          <option value="" disabled>Select a school</option>
          {userData.schools.map((school) => (
            <option key={school.school_id} value={school.school_id}>
              {school.school}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Assigned Course Years</h3>
          <button
            onClick={() => setShowAssigned((prev) => !prev)}
            className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {showAssigned ? 'Hide' : 'Show'}
          </button>
        </div>
        {showAssigned && (
          userData.courses.length > 0 ? (
            <ul className="space-y-4">
              {userData.courses.map((course) => (
                <li key={course.course_id} className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="font-bold text-lg">{course.title} ({course.code})</p>
                  <p className="text-sm text-gray-600">
                    Qualification: {course.qualification}, Part-time: {course.part_time ? 'Yes' : 'No'}
                  </p>
                  <ul className="pl-4 text-sm mt-2 space-y-1">
                    {course.course_years.map((cy) => (
                      <li key={cy.id} className="flex justify-between items-center">
                        <span>Year: {cy.year_start}–{cy.year_end} — Coordinator: {cy.course_coordinator}</span>
                        <button
                          className="ml-4 px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleRemoveCourseYear(cy.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No course years assigned.</p>
          )
        )}
      </div>

      <div className="mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by course title or code..."
          className="w-full max-w-md p-2 mb-4 border rounded dark:text-black"
        />

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Available Course Years</h3>
          <button
            onClick={() => setShowAvailable((prev) => !prev)}
            className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {showAvailable ? 'Hide' : 'Show'}
          </button>
        </div>

        {showAvailable && (
          filteredAvailableCourses.length > 0 ? (
            <ul className="space-y-4">
              {filteredAvailableCourses.map((course) => {
                const unassignedYears = course.course_years.filter(cy => !isCourseYearAssigned(cy.id))
                if (unassignedYears.length === 0) return null

                return (
                  <li key={course.id} className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="font-bold text-lg">{course.title} ({course.code})</p>
                    <p className="text-sm text-gray-600">
                      Qualification: {course.qualification}, Part-time: {course.part_time ? 'Yes' : 'No'}
                    </p>
                    <ul className="pl-4 text-sm mt-2 space-y-1">
                      {unassignedYears.map((cy) => (
                        <li key={cy.id} className="flex justify-between items-center">
                          <span>Year: {cy.year_start}–{cy.year_end} — Coordinator: {cy.course_coordinator}</span>
                          <button
                            className="ml-4 px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                            onClick={() => handleAddCourseYear(cy.id)}
                          >
                            Add
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="italic text-gray-500">No matching course years available.</p>
          )
        )}
      </div>
    </div>
  )
}

export default AddCoursesToUser
