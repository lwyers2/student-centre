const formatUsersFromCourseYears = (users) => {
  const adminStaff = users
    .filter((user) => user.user_course_user.user_role.name === 'Admin')
    .map((user) => ({
      id: user.user_course_user.id,
      name: `${user.user_course_user.prefix} ${user.user_course_user.forename} ${user.user_course_user.surname}`,
    }))

  const teachingStaff = users
    .filter((user) => user.user_course_user.user_role.name === 'Teacher')
    .map((user) => ({
      id: user.user_course_user.id,
      name: `${user.user_course_user.prefix} ${user.user_course_user.forename} ${user.user_course_user.surname}`,
    }))

  return {
    admin_staff: adminStaff,
    teaching_staff: teachingStaff,
  }
}

module.exports = { formatUsersFromCourseYears }
