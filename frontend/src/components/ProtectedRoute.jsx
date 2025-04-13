import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { canAccessAdminPage } from '../utils/permissions'

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user)

  if (!canAccessAdminPage(user)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
