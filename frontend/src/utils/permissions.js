

export const canAccessAdminPage = (user) => user?.role === 3

export const canAccessResource = (user, id, permittedIds = []) => {

  console.log(`User role: ${user?.role}, Resource ID: ${id}, Permitted Modules: ${permittedIds}`)
  if (user?.role === 3) return true
  return permittedIds.includes(id)
}
