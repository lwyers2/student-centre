function formatAllUsers(users) {
  return users.map((user) => {
    const prefix = user.prefix || ''
    const forename = user.forename || ''
    const surname = user.surname || ''
    const name = `${prefix ? prefix + '. ' : ''}${forename} ${surname}`.trim()

    return {
      id: user.id,
      name,
      email: user.email || '',
      active: user.active ?? null,
      date_created: user.date_created ?? null,
      date_updated: user.date_updated ?? null,
      is_active: user.is_active ?? false,
      schools: (user.user_user_school || []).map((school) => ({
        school: school.user_school_school?.school_name || '',
        school_id: school.user_school_school?.id ?? null,
      })),
      role: user.user_role?.name ?? undefined,
    }
  })
}

module.exports = { formatAllUsers }
