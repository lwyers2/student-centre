import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { canAccessResource } from '../../utils/permissions'

const ModuleAccess = ({ children }) => {
  const { moduleId } = useParams()
  const user = useSelector(state => state.user)
  const [showMessage, setShowMessage] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const resolvedModuleId = Number(moduleId)
  const permittedModules = user?.accessible_modules || []



  useEffect(() => {
    if (!canAccessResource(user, resolvedModuleId, user.accessible_modules)) {
      setShowMessage(true)
      const timer = setTimeout(() => setRedirect(true), 10000)
      return () => clearTimeout(timer)
    }
  }, [user, resolvedModuleId, permittedModules])

  if (redirect) {
    return <Navigate to="/" />
  }

  if (showMessage) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        You don’t have permission to view this module. Redirecting...
      </div>
    )
  }

  return children
}

export default ModuleAccess
