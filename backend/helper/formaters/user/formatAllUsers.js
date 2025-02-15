function formatAllUsers(users) {
  return users.map((user) => {
    return {
      id: user.id,
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      active: user.active,
      date_created: user.date_created,
      date_updated: user.date_updated,
      is_active: user.is_active,
      schools: user.user_user_school.map((school) => ({
        school: school.user_school_school.school_name,
        school_id: school.user_school_school.id,
      })),
      role: user.user_role.name
    }
  })
}

module.exports = { formatAllUsers }
