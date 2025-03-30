function formatAllStudentData(student) {
  // Extract student details
  const studentDetails = {
    id: student.id,
    email: student.email,
    student_code: student.student_code,
    forename: student.forename,
    surname: student.surname,
  }

  // Create a map to store courses by their course_year_id
  const courseMap = new Map()

  // Process courses first
  student.student_student_course.forEach((studentCourse) => {
    const courseYear = studentCourse.student_course_course_year || {} // Handle missing course year
    const course = courseYear.course_year_course || {} // Handle missing course data

    // Store course in the map using course_year_id as the key
    courseMap.set(studentCourse.course_year_id, {
      course_year_id: studentCourse.course_year_id,
      course_id: studentCourse.course_id,
      year_start: courseYear.year_start || 'Unknown',
      year_end: courseYear.year_end || 'Unknown',
      title: course.title || 'Unknown Course',
      years: course.years || 'Unknown',
      code: course.code || 'N/A',
      part_time: course.part_time ? 'PT' : 'FY',
      qualification: course.course_qualification_level ? course.course_qualification_level.qualification : 'Not Available',
      course_coordinator: courseYear.course_year_course_coordinator
        ? `${courseYear.course_year_course_coordinator.prefix} ${courseYear.course_year_course_coordinator.forename} ${courseYear.course_year_course_coordinator.surname}`
        : undefined,
      modules: [],
    })
  })

  // Process modules and assign them to the correct course(s)
  student.student_student_module.forEach((studentModule) => {
    const moduleYear = studentModule.student_module_module_year || {} // Handle missing module year
    const module = moduleYear.module_year_module || {} // Handle missing module data
    const courseYears = moduleYear.module_year_module_course || [] // This is now an array

    courseYears.forEach((courseYear) => {
      if (courseYear.course_year_id && courseMap.has(courseYear.course_year_id)) {
        const course = courseMap.get(courseYear.course_year_id)

        // Add module to the corresponding course
        course.modules.push({
          module_year_id: studentModule.module_year_id,
          module_id: module.id || undefined,
          title: module.title || 'Unknown Module',
          code: module.code || 'N/A',
          year: module.year || 'Unknown',
          CATs: module.CATs || 'Unknown',
          semester: moduleYear.module_year_semester ? moduleYear.module_year_semester.name : null,
          module_coordinator: moduleYear.module_year_module_coordinator
            ? `${moduleYear.module_year_module_coordinator.prefix}. ${moduleYear.module_year_module_coordinator.forename} ${moduleYear.module_year_module_coordinator.surname}`
            : undefined,
          result: studentModule.result,
          flagged: studentModule.flagged,
          resit: studentModule.resit,
          result_descriptor: studentModule.student_module_result_descriptor.descriptor
        })
      }
    })
  })

  // Convert map values to an array
  const courses = Array.from(courseMap.values())

  return {
    student: studentDetails,
    courses: courses,
  }
}

module.exports = { formatAllStudentData }
