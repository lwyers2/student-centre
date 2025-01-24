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
      schools: user.school.map((school) => ({
        school: school.school_name,
        school_id: school.user_school.school_id,
      })),
      role: user.role.name
    }
  })
}

module.exports = { formatAllUsers }
