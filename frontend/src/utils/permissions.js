

export const canAccessAdminPage = (user) => user?.role === 3

export const canAccessResource = (user, id, permittedIds = []) => {

  if (user?.role === 3) return true
  return permittedIds.includes(id)
}
