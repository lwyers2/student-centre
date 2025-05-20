import React, { useState } from 'react'
import courseService from '../../../services/course'

const CourseYearsList = ({ courseId, courseYears, setCourseYears, editingYears, setEditingYears, users, user }) => {
  const [editingCoordinatorSelections, setEditingCoordinatorSelections] = useState({})


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
      <h3 className="text-2xl font-semibold mb-4">Course Years</h3>
      <ul className="space-y-2">
        {courseYears.map(year => {
          const isEditing = editingYears[year.id]


          const coordinatorName = year.course_coordinator || 'Not assigned'

          return (
            <li key={year.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <strong>{year.year_start} - {year.year_end}</strong> <br />
                  {!isEditing ? (
                    <>Coordinator: {coordinatorName}</>
                  ) : (
                    <select
                      className="mt-2 p-1 border rounded dark:text-black"
                      value={editingCoordinatorSelections[year.id] || ''}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value)
                        setEditingCoordinatorSelections(prev => ({
                          ...prev,
                          [year.id]: selectedId
                        }))
                      }}
                    >
                      <option value="">Select Coordinator</option>
                      {users?.filter(u => u.role === 'Teacher').map(u => (
                        <option key={u.id} value={u.id}>
                          {u.prefix}. {u.forename} {u.surname}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setEditingYears(prev => ({ ...prev, [year.id]: true }))}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingYears(prev => ({ ...prev, [year.id]: false }))}
                        className="text-blue-600 hover:underline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const selectedUserId = editingCoordinatorSelections[year.id]

                            if (!selectedUserId) {
                              alert('Please select a coordinator before saving.')
                              return
                            }

                            const selectedUser = users.find(u => u.id === selectedUserId)

                            if (!selectedUser) {
                              alert('Selected coordinator not found.')
                              return
                            }

                            const coordinatorString = `${selectedUser.prefix}. ${selectedUser.forename} ${selectedUser.surname}`

                            await courseService.updateCourseYear(
                              user.token,
                              courseId,
                              year.id,
                              selectedUser.id
                            )

                            const updatedCourseYears = courseYears.map(y => {
                              if (y.id === year.id) {
                                return {
                                  ...y,
                                  course_coordinator: `${selectedUser.prefix}. ${selectedUser.forename} ${selectedUser.surname}`
                                }
                              }
                              return y
                            })

                            setCourseYears(updatedCourseYears)

                            alert('Coordinator updated!')
                            setEditingYears(prev => ({ ...prev, [year.id]: false }))
                          } catch (err) {
                            alert('Failed to update coordinator')
                            console.error(err)
                          }
                        }}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                      >
  Save
                      </button>

                    </>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CourseYearsList
