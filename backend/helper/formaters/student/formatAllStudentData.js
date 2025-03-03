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
    const courseYear = studentCourse.student_course_course_year || {} // Handle missing course year
    const course = courseYear.course_year_course || {} // Handle missing course data

    // Ensure course data exists, otherwise provide default structure
    const processedCourse = {
      course_year_id: studentCourse.course_year_id,
      course_id: studentCourse.course_id,
      year_start: courseYear.year_start || 'Unknown',
      year_end: courseYear.year_end || 'Unknown',
      title: course.title || undefined,
      years: course.years || 'Unknown',
      code: course.code || 'N/A',
      part_time: course.part_time ? 'PT' : 'FY',
      qualification: course.course_qualification_level ? course.course_qualification_level.qualification : 'Not Available',
      course_coordinator: courseYear.course_year_course_coordinator
        ? `${courseYear.course_year_course_coordinator.prefix} ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`
        : undefined,
      modules: [],
    }

    // Process modules for this course
    processedCourse.modules = student.student_student_module
      .filter((studentModule) => studentModule.student_module_module_year)
      .map((studentModule) => {
        const moduleYear = studentModule.student_module_module_year || {} // Handle missing module year
        const module = moduleYear.module_year_module || {} // Handle missing module data

        return {
          module_year_id: studentModule.module_year_id,
          module_id: module.id || undefined, // Return undefined instead of 'N/A' if missing
          title: module.title || 'Unknown Module',
          code: module.code || 'N/A',
          year: module.year || 'Unknown',
          CATs: module.CATs || 'Unknown',
          semester: moduleYear.module_year_semester ? moduleYear.module_year_semester.name : null, // Handle missing semester
          module_coordinator: moduleYear.module_year_module_coordinator
            ? `${moduleYear.module_year_module_coordinator.prefix}. ${moduleYear.module_year_module_coordinator.forename} ${moduleYear.module_year_module_coordinator.surname}`
            : undefined,
          result: studentModule.result,
          flagged: studentModule.flagged,
          resit: studentModule.resit,
        }
      })

    return processedCourse
  })

  return {
    student: studentDetails,
    courses: courses,
  }
}

module.exports = { formatAllStudentData }
