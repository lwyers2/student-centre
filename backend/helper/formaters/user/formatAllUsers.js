function formatAllUsers(users) {
  return users.map((user) => {
    return {
      id: user.id,
      forename: user.forename || '',  // Default empty string if forename is missing
      surname: user.surname || '',    // Default empty string if surname is missing
      email: user.email || '',        // Default empty string if email is missing
      active: user.active === undefined ? undefined : user.active || null,  // Default undefined or null for active
      date_created: user.date_created === undefined ? undefined : user.date_created || null,  // Default undefined or null for date_created
      date_updated: user.date_updated === undefined ? undefined : user.date_updated || null,  // Default undefined or null for date_updated
      is_active: user.is_active || false,  // Default false if is_active is missing
      schools: (user.user_user_school || []).map((school) => ({
        school: school.user_school_school?.school_name || '', // Default empty string if school_name is missing
        school_id: school.user_school_school?.id || null,    // Default null if id is missing
      })),
      role: user.user_role?.name || undefined,  // Default undefined if user_role is missing
    }
  })
}

module.exports = { formatAllUsers }
