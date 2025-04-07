const formatUsersFromSchool = (users) => {
  const adminStaff = users
    .filter((user) => user.user_school_user.user_role.name === 'Admin')
    .map((user) => ({
      id: user.user_school_user.id,
      name: `${user.user_school_user.prefix} ${user.user_school_user.forename} ${user.user_school_user.surname}`,
    }))

  const teachingStaff = users
    .filter((user) => user.user_school_user.user_role.name === 'Teacher')
    .map((user) => ({
      id: user.user_school_user.id,
      name: `${user.user_school_user.prefix} ${user.user_school_user.forename} ${user.user_school_user.surname}`,
    }))

  return {
    admin_staff: adminStaff,
    teaching_staff: teachingStaff,
  }
}

module.exports = { formatUsersFromSchool }