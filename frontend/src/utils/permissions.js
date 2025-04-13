// src/utils/permissions.js

export const canAccessAdminPage = (user) => user?.role === 'super_admin'

export const canAccessModule = (user, moduleId, permittedModules = []) => {
  if (user?.role === 'super_admin') return true
  return permittedModules.includes(moduleId)
}
