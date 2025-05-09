const roleAndIdAuthorization = (allowedRoles, resourceOwnerRequired = false) => {
  return (req, res, next) => {
    const { role_name: role, id: authenticatedUserId, } = req.user
    const { user: requestedUserId } = req.params

    // If resourceOwnerRequired is true, ensure the requesting user is the same as the requested user
    const isResourceOwner = resourceOwnerRequired && authenticatedUserId === parseInt(requestedUserId)

    // If user is not the same as the resource owner and role is not allowed
    if (!allowedRoles.includes(role) && !isResourceOwner) {
      const error = new Error('You are not authorized to access this resource')
      error.status = 403
      return next(error)
    }

    next()
  }
}

module.exports = roleAndIdAuthorization