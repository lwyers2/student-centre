function formatAllStudentData(student) {
  const studentCourseYears = student.student_course_years
  const studentModuleYears = student.student_module_years

  return {
    id: student.id,
    email: student.email,
    student_code: student.student_code,
    forename: student.forename,
    surname: student.surname,
    courses: studentCourseYears.map((studentCourseYear) => {
      const groupedModules = studentModuleYears
        .filter((studentModuleYear) =>
          studentModuleYear.module_courses.some(
            (moduleCourse) => moduleCourse.course_year_id === studentCourseYear.id
          )
        )
        .reduce((acc, studentModuleYear) => {
          const year = studentModuleYear.module.year
          if (!acc[year]) {
            acc[year] = []
          }
          acc[year].push({
            module_year_id: studentModuleYear.id,
            year_start: studentModuleYear.year_start,
            module_coordinator_id: studentModuleYear.module_coordinator_id,
            semester: studentModuleYear.semester.name,
            module_coordinator: `${studentModuleYear['module_co-ordinator'].prefix} ${studentModuleYear['module_co-ordinator'].forename} ${studentModuleYear['module_co-ordinator'].surname}`,
            title: studentModuleYear.module.title,
            module_id: studentModuleYear.module.id,
            code: studentModuleYear.module.code,
            CATs: studentModuleYear.module.CATs,
            year: studentModuleYear.module.year,
            student_module: studentModuleYear.student_module,
          })
          return acc
        }, {})

      const groupedModulesArray = Object.entries(groupedModules).map(
        ([module_year, modules]) => ({
          module_year: Number(module_year),
          modules,
        })
      )

      return {
        course_year_id: studentCourseYear.id,
        course_id: studentCourseYear.course.id,
        year_start: studentCourseYear.year_start,
        year_end: studentCourseYear.year_end,
        title: studentCourseYear.course.title,
        years: studentCourseYear.course.years,
        code: studentCourseYear.course.code,
        part_time: studentCourseYear.course.part_time ? 'PT' : 'FY',
        qualification: studentCourseYear.course.qualification_level.qualification,
        course_coordinator: `${studentCourseYear['course_co-ordinator'].forename} ${studentCourseYear['course_co-ordinator'].surname}`,
        module_years: groupedModulesArray,
      }
    }),
  }
}

module.exports = { formatAllStudentData }
