function formatUserStudents(user) {
  let uniqueStudents = []

  // Because we are getting user_modules it will return the same module, but multiple multiple module_years
  // So we need to loop through the user_module_user and get the module_year_student_module
  // and then get the student from that
  user.user_module_user.forEach((module) => {
    if (Array.isArray(module.user_module_module_year.module_year_student_module)) {
      module.user_module_module_year.module_year_student_module.forEach((studentModule) => {
        const student = studentModule.student_module_student
        // Add student to uniqueStudents array if not already present
        if (student && !uniqueStudents.some(existingStudent => existingStudent.id === student.id)) {
          uniqueStudents.push(student)
        }
      })
    }
  })


  // Return the formatted user object with unique students
  return {
    user: {
      id: user.id,
      prefix: user.prefix,
      forename: user.forename,
      surname: user.surname,
    },
    students: uniqueStudents,
  }
}

module.exports = { formatUserStudents }
