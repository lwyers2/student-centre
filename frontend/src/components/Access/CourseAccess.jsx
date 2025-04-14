import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { canAccessResource } from '../../utils/permissions'

const CourseAccess = ({ children }) => {
  const { courseId } = useParams()
  const user = useSelector(state => state.user)
  const [showMessage, setShowMessage] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const resolvedCourseId = Number(courseId)
  const permittedCourses = user?.accessible_courses || []



  useEffect(() => {
    if (!canAccessResource(user, resolvedCourseId, permittedCourses)) {
      setShowMessage(true)
      const timer = setTimeout(() => setRedirect(true), 10000)
      return () => clearTimeout(timer)
    }
  }, [user, resolvedCourseId, permittedCourses])

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

export default CourseAccess
