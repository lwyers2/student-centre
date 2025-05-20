import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import courseService from '../../services/course'
import userService from '../../services/user'
import qualificationsService from '../../services/qualifications'
import CourseDetailsForm from '../../components/CourseView/Edit/CourseDetailsForm'
import CourseYearsList from '../../components/CourseView/Edit/CourseYearsList'
import AddCourseYearForm from '../../components/CourseView/Edit/AddCourseYearForm'

const EditCourse = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const params = useParams()

  const [course, setCourse] = useState(null)
  const [courseYears, setCourseYears] = useState([])
  const [newYear, setNewYear] = useState({ year_start: 2020, course_coordinator_id: '' })
  const [formState, setFormState] = useState({ title: '', code: '', qualification: '', part_time: false })
  const [users, setUsers] = useState([])
  const [editingYears, setEditingYears] = useState({})
  const [showAddYear, setShowAddYear] = useState(false)
  const [qualifications, setQualifications] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (!user?.token || !params.courseId) return

    courseService.getOneCourse(user.token, params.courseId)
      .then(response => {
        const fetchedCourseYears = response.course_years
        const allUsers = response.users

        const updatedCourseYears = fetchedCourseYears.map(year => {
          const matchingUser = allUsers.find(u =>
            `${u.prefix}. ${u.forename} ${u.surname}` === year.course_coordinator
          )
          return {
            ...year,
            course_coordinator_id: matchingUser?.id || null
          }
        })

        setCourse(response.course)
        setCourseYears(updatedCourseYears)
        setUsers(allUsers)
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
  }, [user?.token, params.courseId])

  useEffect(() => {
    if (!course || !user?.token) return

    qualificationsService.getAll(user.token)
      .then(setQualifications)
      .catch(err => {
        console.error(err)
        alert('Failed to fetch qualifications')
      })
  }, [course, user?.token])

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
      const created = await courseService.addCourseYear(
        user.token,
        params.courseId,
        newYear.year_start,
        course.years,
        newYear.course_coordinator_id
      )

      const coordinatorUser = users.find(u => u.id === Number(newYear.course_coordinator_id))

      const createdWithCoordinatorName = {
        ...created,
        course_coordinator: coordinatorUser
          ? `${coordinatorUser.prefix}. ${coordinatorUser.forename} ${coordinatorUser.surname}`
          : 'Unknown Coordinator',
        course_coordinator_id: newYear.course_coordinator_id
      }

      setCourseYears(prev => [...prev, createdWithCoordinatorName])
      setNewYear({ year_start: 2020, course_coordinator_id: '' })
      alert('Course year added!')
    } catch (err) {
      console.error(err)
      alert('Failed to add course year')
    }
  }

  if (!user) return null
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

      <CourseDetailsForm
        formState={formState}
        qualifications={qualifications}
        handleCourseChange={handleCourseChange}
        handleCourseSubmit={handleCourseSubmit}
      />

      <CourseYearsList
        courseYears={courseYears}
        setCourseYears={setCourseYears}
        editingYears={editingYears}
        setEditingYears={setEditingYears}
        users={users}
        user={user}
        courseId={course.id}
      />

      <AddCourseYearForm
        showAddYear={showAddYear}
        setShowAddYear={setShowAddYear}
        newYear={newYear}
        handleNewYearChange={handleNewYearChange}
        handleNewYearSubmit={handleNewYearSubmit}
        users={users}
        courseYearsAmount={course.years}
      />
    </div>
  )
}

export default EditCourse
