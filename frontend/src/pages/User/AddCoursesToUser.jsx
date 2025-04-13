import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../../services/user'

const AddCoursesToUser = () => {
  const { userId } = useParams()
  const user = useSelector((state) => state.user)
  const [userData, setUserData] = useState(null)
  const [availableCourseYears, setAvailableCourseYears] = useState([])

  useEffect(() => {
    const mockAvailableCourseYears = [
      {
        title: 'Mathematics',
        course_id: 10,
        course_years: [
          { id: 101, year_start: 2021, year_end: 2024, course_coordinator: 'Dr. Alice' },
          { id: 102, year_start: 2022, year_end: 2025, course_coordinator: 'Dr. Alice' }
        ]
      },
      {
        title: 'History',
        course_id: 11,
        course_years: [
          { id: 201, year_start: 2023, year_end: 2026, course_coordinator: 'Dr. Bob' }
        ]
      }
    ]

    userService.getUser(userId, user.token)
      .then((response) => {
        setUserData(response)
        setAvailableCourseYears(mockAvailableCourseYears)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }, [userId, user.token])

  if (!userData) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">
        Assign Course Years to {userData.forename} {userData.surname}
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Schools</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {userData.schools.map((s, idx) => (
            <li key={idx}>{s.school}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Available Course Years</h3>
        <ul className="space-y-4">
          {availableCourseYears.map((course) => (
            <li key={course.course_id} className="border rounded p-3">
              <div className="font-bold text-lg">{course.title}</div>
              <ul className="mt-2 pl-4 text-sm text-gray-700 space-y-1">
                {course.course_years.map((cy) => (
                  <li key={cy.id}>
                    Year: {cy.year_start}–{cy.year_end} — Coordinator: {cy.course_coordinator}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Assigned Course Years</h3>
        {userData.courses.length > 0 ? (
          <ul className="space-y-4">
            {userData.courses.map((course) => (
              <li key={course.course_id} className="border rounded p-3">
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
        )}
      </div>
    </div>
  )
}

export default AddCoursesToUser
