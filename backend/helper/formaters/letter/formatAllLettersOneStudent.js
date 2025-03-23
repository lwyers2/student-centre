function formatAllLettersOneStudent(letters) {
  return letters.map((letter) => ({
    id: letter.id,
    date_sent: letter.date_sent,
    authorised: letter.authorised,
    sent_by: `${letter.letter_sent_by_user.prefix} ${letter.letter_sent_by_user.forename} ${letter.letter_sent_by_user.surname}`,
    authorised_by: `${letter.letter_authorised_by_staff.prefix} ${letter.letter_authorised_by_staff.forename} ${letter.letter_authorised_by_staff.surname}`,
    type: letter.letter_letter_type.name,
    module: {
      id: letter.letter_student_module.module_id,
      result: letter.letter_student_module.result,
      flagged: letter.letter_student_module.flagged,
      module_year_id: letter.letter_student_module.module_year_id,
      title: letter.letter_student_module.student_module_module.title,
      year: letter.letter_student_module.student_module_module.year,
      code: letter.letter_student_module.student_module_module.code,
      year_start: letter.letter_student_module.student_module_module_year.year_start
    },
    student: {
      id: letter.letter_student_module.student_module_student.id,
      name: `${letter.letter_student_module.student_module_student.forename} ${letter.letter_student_module.student_module_student.surname}`,
      email: letter.letter_student_module.student_module_student.email,
      student_code: letter.letter_student_module.student_module_student.student_code
    }
  }))
}

module.exports = { formatAllLettersOneStudent }