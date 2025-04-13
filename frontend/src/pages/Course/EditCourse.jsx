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

  const filteredAvailableCourses = availableCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!userData) return <div>Loading...</div>

  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
        Assign Course Years to {userData.forename} {userData.surname}
      </h2>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
        <h3 className="text-2xl font-semibold mb-4">Select School</h3>
        <select
          value={selectedSchoolId || ''}
          onChange={handleSchoolChange}
          className="p-2 rounded border w-full max-w-md dark:text-black"
        >
          <option value="" disabled>Select a school</option>
          {userData.schools.map((school) => (
            <option key={school.school_id} value={school.school_id}>
              {school.school}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Assigned Course Years</h3>
          <button onClick={() => setShowAssigned((prev) => !prev)} className="text-blue-600 underline text-sm">
            {showAssigned ? 'Hide' : 'Show'}
          </button>
        </div>
        {showAssigned && (
          userData.courses.length > 0 ? (
            <ul className="space-y-4">
              {userData.courses.map((course) => (
                <li key={course.course_id} className="border rounded p-4 dark:bg-slate-700">
                  <div className="font-bold text-lg">{course.title} ({course.code})</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Qualification: {course.qualification}, Part-time: {course.part_time ? 'Yes' : 'No'}
                  </div>
                  <ul className="pl-4 text-sm text-gray-700 space-y-1">
                    {course.course_years.map((cy) => (
                      <li key={cy.id}>
                        Year: {cy.year_start}–{cy.year_end} — Coordinator: {cy.course_coordinator}
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

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by course title or code..."
          className="p-2 border rounded w-full max-w-md mb-4 dark:text-black"
        />

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Available Course Years</h3>
          <button onClick={() => setShowAvailable((prev) => !prev)} className="text-blue-600 underline text-sm">
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
                  <li key={course.id} className="border rounded p-4 dark:bg-slate-700">
                    <div className="font-bold text-lg">{course.title} ({course.code})</div>
                    <div className="text-sm text-gray-600 mb-2">
                      Qualification: {course.qualification}, Part-time: {course.part_time ? 'Yes' : 'No'}
                    </div>
                    <ul className="pl-4 text-sm text-gray-700 space-y-1">
                      {unassignedYears.map((cy) => (
                        <li key={cy.id}>
                          Year: {cy.year_start}–{cy.year_end} — Coordinator: {cy.course_coordinator}
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
