function formatAllCourses(courses) {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    code: course.code,
    qualification: course.course_qualification_level.qualification,
    school: course.course_school.school_name,
    part_time: course.part_time,
    years: course.years
  }))
}

module.exports = { formatAllCourses }