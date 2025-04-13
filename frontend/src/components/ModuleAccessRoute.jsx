import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'

const ModuleAccessRoute = ({ children }) => {
  const { moduleId } = useParams()
  const user = useSelector((state) => state.user)

  const allowedModules = user?.modules || [] // e.g., [94, 170, etc.]

  // Convert moduleId from URL (string) to number
  const numericModuleId = Number(moduleId)

  if (!allowedModules.includes(numericModuleId)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ModuleAccessRoute
