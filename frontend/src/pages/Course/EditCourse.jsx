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
  const [course, setCourse] = useState(null)
  const [courseYears, setCourseYears] = useState([])
  const [newYear, setNewYear] = useState({ year_start: 2020, year_end: '', course_coordinator: '' })
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
          const fetchedCourseYears = response.course_years
          const allUsers = response.users

          // ✨ Now map over course years to assign the correct coordinator ID
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
          setCourseYears(updatedCourseYears) // ✅ Updated with IDs
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
      <CourseDetailsForm
        formState={formState}
        qualifications={qualifications}
        handleCourseChange={handleCourseChange}
        handleCourseSubmit={handleCourseSubmit}
      />

      {/* Existing Course Years */}
      <CourseYearsList
        courseYears={courseYears}
        setCourseYears={setCourseYears}
        editingYears={editingYears}
        setEditingYears={setEditingYears}
        users={users}
        user={user}
        courseId={course.id}
      />

      {/* Toggle Add Year */}
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