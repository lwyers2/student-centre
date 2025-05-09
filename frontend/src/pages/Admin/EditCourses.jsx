import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import courseService from '../../services/course'
import CourseFilters from '../../components/Edit/Course/CourseFilters'
import FilteredCourseList from '../../components/Edit/Course/FilteredCourseList'

const EditCourses = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [school, setSchool] = useState('')
  const [qualification, setQualification] = useState('')
  const [fullTime, setFullTime] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (user?.id) {
      courseService.getAll(user.token)
        .then(setCourses)
        .catch(() => setCourses([]))
    }
  }, [user?.id])

  if (!user?.id) return <div>Loading...</div>

  const uniqueQualifications = [...new Set(courses.map(course => course.qualification))].sort()
  const uniqueSchools = [...new Set(courses.map(course => course.school))].sort()
  const uniqueFullTimeStatus = [...new Set(courses.map(course => course.part_time === 0 ? 'Full-Time' : 'Part-Time'))]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = search === '' ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase())

    const matchesQualification = qualification ? course.qualification === qualification : true
    const matchesSchool = school ? course.school === school : true
    const matchesFullTime = fullTime
      ? (fullTime === 'Full-Time' ? course.part_time === 0 : course.part_time === 1)
      : true

    return matchesSearch && matchesQualification && matchesSchool && matchesFullTime
  })

  return (
    <div className="w-auto p-2 my-6 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-8 text-slate-900 dark:text-white">
        Find Course to Edit
      </h2>

      <CourseFilters
        search={search}
        setSearch={setSearch}
        qualification={qualification}
        setQualification={setQualification}
        school={school}
        setSchool={setSchool}
        fullTime={fullTime}
        setFullTime={setFullTime}
        uniqueQualifications={uniqueQualifications}
        uniqueSchools={uniqueSchools}
        uniqueFullTimeStatus={uniqueFullTimeStatus}
        showFilters={showFilters}
        toggleFilters={() => setShowFilters(!showFilters)}
      />

      <FilteredCourseList filteredCourses={filteredCourses} search={search} />
    </div>
  )
}

export default EditCourses
