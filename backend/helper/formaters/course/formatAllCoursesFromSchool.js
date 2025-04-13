function formatAllCoursesFromSchool(courses) {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    code: course.code,
    qualification: course.course_qualification_level.qualification,
    school: course.course_school.school_name,
    part_time: course.part_time,
    years: course.years,
    course_years: course.course_course_year.map((courseYear) => ({
      id: courseYear.id,
      year_start: courseYear.year_start,
      year_end: courseYear.year_end,
      course_coordinator: `${courseYear.course_year_course_coordinator.prefix}. ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`
    }))
  }))
}

module.exports = { formatAllCoursesFromSchool }
