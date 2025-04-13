function formatUserDetails(user) {
  return {
    id: user.id,
    prefix: user.prefix || '',
    forename: user.forename || '',
    surname: user.surname || '',
    email: user.email || '',
    active: user.active || undefined,
    date_created: user.date_created || undefined,
    date_updated: user.date_updated || undefined,
    job_title: user.job_title || '',
    is_active: user.is_active || undefined,
    schools: (user.user_user_school || []).map((school) => ({
      school: school.user_school_school?.school_name || '',
      school_id: school.user_school_school?.id || 0,
    })),
    role: user.user_role || null,
  }
}

module.exports = { formatUserDetails }
