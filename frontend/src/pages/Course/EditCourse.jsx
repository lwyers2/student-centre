import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import courseService from '../../services/course'
import userService from '../../services/user'
import qualificationsService from '../../services/qualifications'

const EditCourse = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [courseYears, setCourseYears] = useState([])
  const [newYear, setNewYear] = useState({ year_start: '', year_end: '', course_coordinator: '' })
  const [formState, setFormState] = useState({ title: '', code: '', qualification: '', part_time: false, })
  const [users, setUsers] = useState([])
  const [adminUsersFromSchool, setAdminUsersFromSchool] = useState(null)
  const [teacherFromSchool, setTeacherUsersFromSchool] = useState(null)
  const [editingYears, setEditingYears] = useState({})
  const [showAddYear, setShowAddYear] = useState(false)
  const [qualifications, setQualifications] = useState([])


  const params = useParams()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (user?.id) {
      courseService.getOneCourse(user.token, params.courseId)
        .then(response => {
          setCourse(response.course)
          setCourseYears(response.course_years)
          setUsers(response.users)
          setFormState({
            title: response.course.title,
            code: response.course.code,
            qualification: response.course.qualification,
            part_time: !!response.course.part_time,
            school: response.course.school
          })
        })
        .catch(() => {
          setCourse(null)
          setCourseYears([])
          setUsers([])
        })
    }
  }, [user.token, params.courseId])

  useEffect(() => {
    if(course?.id && course?.school_id) {
      userService.getUsersFromSchool(course.school_id)
        .then(response => {
          setAdminUsersFromSchool(response.admin_staff)
          setTeacherUsersFromSchool(response.teaching_staff)
        })
    }
  }, [course?.school_id, user.token])

  useEffect(() => {
    if (course) {
      qualificationsService.getAll(user.token)
        .then(response => {
          setQualifications(response)
        })
        .catch(err => {
          console.error(err)
          alert('Failed to fetch qualifications')
        })
    }
  }, [course, user.token])

  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    try {
      const updated = await courseService.updateCourse(user.token, params.courseId, formState)
      setCourse(updated)
      alert('Course updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Error updating course')
    }
  }

  const handleNewYearChange = (e) => {
    const { name, value } = e.target
    setNewYear(prev => ({ ...prev, [name]: value }))
  }

  const handleNewYearSubmit = async (e) => {
    e.preventDefault()
    const existingYearStarts = courseYears.map(y => Number(y.year_start))
    const minYear = Math.min(...existingYearStarts)
    const maxYear = Math.max(...existingYearStarts)
    const newStart = Number(newYear.year_start)

    if (
      existingYearStarts.includes(newStart) ||
      (newStart < minYear - course.years || newStart > maxYear + course.years)
    ) {
      alert(`You can only add a year before ${minYear} or after ${maxYear}, up to ${course.years} years total.`)
      return
    }

    try {
      const created = await courseService.addCourseYear(user.token, params.courseId, newYear)
      setCourseYears(prev => [...prev, created])
      setNewYear({ year_start: '', year_end: '', course_coordinator: '' })
      alert('Course year added!')
    } catch (err) {
      console.error(err)
      alert('Failed to add course year')
    }
  }

  if (!user?.id) return <div>Loading user...</div>
  if (!course) return <div>Loading course...</div>


  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
        Edit Course
      </h2>
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
        {course.title} ({course.code})
      </h2>

      {/* Course Details Form */}
      <form onSubmit={handleCourseSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
        <h3 className="text-2xl font-semibold mb-4">Course Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-black">
          <input name="title" value={formState.title} onChange={handleCourseChange} className="p-2 rounded border" placeholder="Title" />
          <input name="code" value={formState.code} onChange={handleCourseChange} className="p-2 rounded border" placeholder="Code" />
          <select
            name="qualification"
            value={formState.qualification}
            onChange={handleCourseChange}
            className="p-2 rounded border"
          >
            <option value="">Select Qualification</option>
            {qualifications.map(q => (
              <option key={q.id} value={q.qualification}>
                {q.qualification}
              </option>
            ))}
          </select>          <label className="flex items-center gap-2 col-span-full dark:text-white">
            <input type="checkbox" name="part_time" checked={formState.part_time} onChange={handleCourseChange} />
            Part Time
          </label>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>

      {/* Existing Course Years */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
        <h3 className="text-2xl font-semibold mb-4">Course Years</h3>
        <ul className="space-y-2">
          {courseYears.map(year => {
            const isEditing = editingYears[year.id]

            return (
              <li key={year.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{year.year_start} - {year.year_end}</strong> <br />
                    {!isEditing ? (
                      <>Coordinator: {year.course_coordinator}</>
                    ) : (
                      <select
                        className="mt-2 p-1 border rounded"
                        value={year.course_coordinator}
                        onChange={(e) => {
                          const updated = courseYears.map(y =>
                            y.id === year.id ? { ...y, course_coordinator: e.target.value } : y
                          )
                          setCourseYears(updated)
                        }}
                      >
                        <option value="">Select Coordinator</option>
                        {users?.filter(u => u.role === 'Teacher').map(u => (
                          <option key={u.id} value={`${u.prefix}. ${u.forename} ${u.surname}`}>
                            {u.prefix}. {u.forename} {u.surname}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => setEditingYears(prev => ({ ...prev, [year.id]: !isEditing }))}
                      className="text-blue-600 hover:underline"
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                      <button
                        onClick={async () => {
                          try {
                            await courseService.updateCourseYear(user.token, year.id, {
                              course_coordinator: year.course_coordinator
                            })
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
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Toggle Add Year */}
      <button
        onClick={() => setShowAddYear(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showAddYear ? 'Hide Add Year' : 'Add New Course Year'}
      </button>

      {/* Add New Course Year */}
      {showAddYear && (
        <form onSubmit={handleNewYearSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Add Course Year</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 dark:text-black">
            <input name="year_start" type="number" value={newYear.year_start} onChange={handleNewYearChange} className="p-2 rounded border" placeholder="Year Start" />
            <input name="year_end" type="number" value={newYear.year_end} onChange={handleNewYearChange} className="p-2 rounded border" placeholder="Year End" />
            <select
              name="course_coordinator"
              value={newYear.course_coordinator}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
            >
              <option value="">Select Coordinator</option>
              {users?.filter(u => u.role === 'Teacher').map(user => (
                <option key={user.id} value={`${user.prefix}. ${user.forename} ${user.surname}`}>
                  {user.prefix}. {user.forename} {user.surname}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Add Year
          </button>
        </form>
      )}
    </div>
  )
}

export default EditCourse