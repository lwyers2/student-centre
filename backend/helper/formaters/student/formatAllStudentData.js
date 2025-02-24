function formatAllStudentData(student) {
  // Extract student details
  const studentDetails = {
    id: student.id,
    email: student.email,
    student_code: student.student_code,
    forename: student.forename,
    surname: student.surname,
  }

  // Process courses and group their modules
  const courses = student.student_student_course.map((studentCourse) => {
    const courseYear = studentCourse.student_course_course_year
    const course = courseYear.course_year_course

    // Filter modules that belong to this course
    const courseModules = student.student_student_module
      .filter((studentModule) =>
        studentModule.student_module_module_year.module_year_module_course.some(
          (moduleCourse) => moduleCourse.course_year_id === studentCourse.course_year_id
        )
      )
      .map((studentModule) => {
        const moduleYear = studentModule.student_module_module_year
        const module = moduleYear.module_year_module

        return {
          module_year_id: studentModule.module_year_id,
          module_id: module.id,
          title: module.title,
          code: module.code,
          year: module.year,
          CATs: module.CATs,
          semester: moduleYear.module_year_semester.name,
          module_coordinator: `${moduleYear.module_year_module_coordinator.prefix} ${moduleYear.module_year_module_coordinator.forename} ${moduleYear.module_year_module_coordinator.surname}`,
          result: studentModule.result,
          flagged: studentModule.flagged,
          resit: studentModule.resit,
        }
      })

    return {
      course_year_id: studentCourse.course_year_id,
      course_id: studentCourse.course_id,
      year_start: courseYear.year_start,
      year_end: courseYear.year_end,
      title: course.title,
      years: course.years,
      code: course.code,
      part_time: course.part_time ? 'PT' : 'FY',
      qualification: course.course_qualification_level.qualification,
      course_coordinator: `${courseYear.course_year_course_coordinator.prefix} ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`,
      modules: courseModules,
    }
  })

  return {
    student: studentDetails,
    courses: courses,
  }
}


module.exports = { formatAllStudentData }
