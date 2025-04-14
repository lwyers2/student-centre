import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { canAccessResource } from '../../utils/permissions'

const ModuleYearAccess = ({ children }) => {
  const { moduleYearId } = useParams()
  const user = useSelector(state => state.user)
  const [showMessage, setShowMessage] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const resolvedModuleYearId = Number(moduleYearId)
  const permittedModules = user?.accessible_module_years || []



  useEffect(() => {
    if (!canAccessResource(user, resolvedModuleYearId, user.accessible_module_years)) {
      setShowMessage(true)
      const timer = setTimeout(() => setRedirect(true), 10000)
      return () => clearTimeout(timer)
    }
  }, [user, resolvedModuleYearId, permittedModules])

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

export default ModuleYearAccess
