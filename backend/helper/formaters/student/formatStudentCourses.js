function formatStudentCourses(student) {

  const studentCourseYears = student.student_course_years

  return {
    id: student.id,
    email: student.email,
    student_code: student.student_code,
    forename: student.forname,
    surname: student.surname,
    courses: studentCourseYears.map((studentCourseYear) => ({
      course_year_id: studentCourseYear.id,
      course_id: studentCourseYear.course.id,
      year_start: studentCourseYear.year_start,
      year_end: studentCourseYear.year_end,
      title: studentCourseYear.course.title,
      years: studentCourseYear.course.years,
      code: studentCourseYear.course.code,
      part_time: studentCourseYear.course.part_time? 'PT' : 'FY',
      qualification: studentCourseYear.course.qualification_level.qualification,
      course_coordinator: studentCourseYear['course_co-ordinator'].forename + ' ' + studentCourseYear['course_co-ordinator'].surname,
    }))
  }
}

module.exports = { formatStudentCourses }