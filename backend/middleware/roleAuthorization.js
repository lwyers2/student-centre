const roleMap = {
  'Admin': 1,
  'Teacher': 2,
  'Super User': 3,
}

const roleAuthorization = (allowedRoles) => {
  //mapping roles as a const above so that can enter role name in for better readability
  const allowedRoleIds = allowedRoles.map((role) => roleMap[role] || role )
  return (req, res, next) => {
    //using includes as there are pages where multiple roles can access
    if(req.user && allowedRoleIds.includes(req.user.role_id)) {
      next()
    } else {
      return res.status(403).json({ error: `Access denied: insufficient permissions {Role needed: ${allowedRoleIds[0]} actual role id: ${req.user.role_id}}` })
    }
  }
}

module.exports = roleAuthorization