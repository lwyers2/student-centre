const formatUsersFromModule = (users) => {
  const adminStaff = users
    .filter((user) => user.user_role.name === 'Admin')
    .map((user) => ({
      id: user.id,
      name: `${user.prefix} ${user.forename} ${user.surname}`,
    }))
  const teachingStaff = users
    .filter((user) => user.user_role.name === 'Teacher')
    .map((user) => ({
      id: user.id,
      name: `${user.prefix} ${user.forename} ${user.surname}`,
    }))
  return {
    admin_staff: adminStaff,
    teaching_staff: teachingStaff,
  }
}
module.exports = { formatUsersFromModule }