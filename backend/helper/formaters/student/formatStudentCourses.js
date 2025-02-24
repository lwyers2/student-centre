function formatStudentCourses(student) {


  const studentCourseYears = student.student_student_course

  return {
    id: student.id,
    email: student.email,
    student_code: student.student_code,
    forename: student.forname,
    surname: student.surname,
    courses: studentCourseYears.map((studentCourseYear) => ({
      course_year_id: studentCourseYear.student_course_course_year.id,
      course_id: studentCourseYear.student_course_course_year.course_id,
      year_start: studentCourseYear.student_course_course_year.year_start,
      year_end: studentCourseYear.student_course_course_year.year_end,
      title: studentCourseYear.student_course_course_year.course_year_course.title,
      years: studentCourseYear.student_course_course_year.course_year_course.years,
      code: studentCourseYear.student_course_course_year.course_year_course.code,
      part_time: studentCourseYear.student_course_course_year.course_year_course.part_time,
      qualification: studentCourseYear.student_course_course_year.course_year_course.course_qualification_level.qualification,
      course_coordinator: `${studentCourseYear.student_course_course_year.course_year_course_coordinator.prefix}. ${studentCourseYear.student_course_course_year.course_year_course_coordinator.forename} ${studentCourseYear.student_course_course_year.course_year_course_coordinator.surname}`,
    }))
  }
}

module.exports = { formatStudentCourses }