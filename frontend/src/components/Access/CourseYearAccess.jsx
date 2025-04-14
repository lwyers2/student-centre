import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { canAccessResource } from '../../utils/permissions'
import course from '../../services/course'

const CourseYearAccess = ({ children }) => {
  const { courseYearId } = useParams()
  const user = useSelector(state => state.user)
  const [showMessage, setShowMessage] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const params = useParams()

  const resolvedCourseYearId = Number(courseYearId)
  const permittedCourseYears = user?.accessible_course_years || []

  useEffect(() => {
    if (!canAccessResource(user, resolvedCourseYearId, permittedCourseYears)) {
      setShowMessage(true)
      const timer = setTimeout(() => setRedirect(true), 10000)
      return () => clearTimeout(timer)
    }
  }, [user, resolvedCourseYearId, permittedCourseYears])

  if (redirect) {
    return <Navigate to="/" />
  }

  if (showMessage) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        You don’t have permission to view this course. Redirecting...
      </div>
    )
  }

  return children
}

export default CourseYearAccess
