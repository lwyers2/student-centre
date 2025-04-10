function formatOneStudentOneModuleYear(student, letterCount, course) {
  const studentStudentModule = student.student_student_module[0]

  if (!studentStudentModule) {
    throw new Error('Student module data is missing')
  }

  const moduleYear = studentStudentModule.student_module_module_year || {}
  const semester = moduleYear.module_year_semester?.name || undefined
  const moduleCoordinator = moduleYear.module_year_module_coordinator
    ? `${moduleYear.module_year_module_coordinator.prefix }. ${moduleYear.module_year_module_coordinator.forename } ${moduleYear.module_year_module_coordinator.surname }`.trim()
    : undefined

  const letter = studentStudentModule.student_module_letter[0]

  return {
    student: {
      id: student.id,
      email: student.email,
      student_code: student.student_code,
      forename: student.forename,
      surname: student.surname,
      letter_count_for_academic_year: letterCount
    },
    course: {
      id: course.course_id,
      course_year_id: course.id,
      year_start: course.year_start,
      year_end: course.year_end,
      title: course.course_year_course.title,
    },
    module: {
      module_year_id: studentStudentModule.module_year_id,
      year_start: moduleYear.year_start || undefined,
      semester,
      module_coordinator: moduleCoordinator,
      title: moduleYear.module_year_module?.title || undefined,
      module_id: moduleYear.module_year_module?.id || undefined,
      code: moduleYear.module_year_module?.code || undefined,
      CATs: moduleYear.module_year_module?.CATs || undefined,
      year: moduleYear.module_year_module?.year || undefined,
      result: studentStudentModule.result ?? undefined,
      result_descriptor: studentStudentModule.student_module_result_descriptor.descriptor,
      flagged: studentStudentModule.flagged ?? false,
      resit: studentStudentModule.resit ?? false,
    },
    letter: letter
      ? {
        id: letter.id,
        sent: letter.sent,
        authorised: letter.authorised,
        sent_by_user: `${letter.letter_sent_by_user.prefix}. ${letter.letter_sent_by_user.forename} ${letter.letter_sent_by_user.surname}`,
        date_sent: letter.date_sent
          ? new Date(letter.date_sent).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })
          : undefined,
        authorised_by_user: `${letter.letter_authorised_by_staff.prefix}. ${letter.letter_authorised_by_staff.forename} ${letter.letter_authorised_by_staff.surname}`,
        title: letter.letter_letter_type.name
      }
      : {}
  }
}

module.exports = { formatOneStudentOneModuleYear }
