const { CourseYear } = require('../../models')

async function seedCourseYears(courses, users) {
  const courseYears = await CourseYear.bulkCreate([
    { course_id: courses['Drama - FT'], year_start: 2021, year_end: 2024, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Drama - FT'], year_start: 2022, year_end: 2025, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Drama - FT'], year_start: 2023, year_end: 2026, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Drama - FT'], year_start: 2024, year_end: 2027, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film Studies and Production - FT'], year_start: 2021, year_end: 2024, course_coordinator: users['jane.smith@example.com'] },
    { course_id: courses['Film Studies and Production - FT'], year_start: 2022, year_end: 2025, course_coordinator: users['jane.smith@example.com'] },
    { course_id: courses['Film Studies and Production - FT'], year_start: 2023, year_end: 2026, course_coordinator: users['jane.smith@example.com'] },
    { course_id: courses['Film Studies and Production - FT'], year_start: 2024, year_end: 2027, course_coordinator: users['jane.smith@example.com'] },
    { course_id: courses['Film and Theatre Making - FT'], year_start: 2021, year_end: 2024, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Film and Theatre Making - FT'], year_start: 2022, year_end: 2025, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Film and Theatre Making - FT'], year_start: 2023, year_end: 2026, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Film and Theatre Making - FT'], year_start: 2024, year_end: 2027, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Drama and English - FT'], year_start: 2021, year_end: 2024, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Drama and English - FT'], year_start: 2022, year_end: 2025, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Drama and English - FT'], year_start: 2023, year_end: 2026, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['Drama and English - FT'], year_start: 2024, year_end: 2027, course_coordinator: users['alice.johnson@example.com'] },
    { course_id: courses['English and Film Studies - FT'], year_start: 2021, year_end: 2024, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['English and Film Studies - FT'], year_start: 2022, year_end: 2025, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['English and Film Studies - FT'], year_start: 2023, year_end: 2026, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['English and Film Studies - FT'], year_start: 2024, year_end: 2027, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - FT'], year_start: 2021, year_end: 2024, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - FT'], year_start: 2022, year_end: 2025, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - FT'], year_start: 2023, year_end: 2026, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - FT'], year_start: 2024, year_end: 2027, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - PT'], year_start: 2021, year_end: 2024, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - PT'], year_start: 2022, year_end: 2025, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - PT'], year_start: 2023, year_end: 2026, course_coordinator: users['john.doe@example.com'] },
    { course_id: courses['Film - PT'], year_start: 2024, year_end: 2027, course_coordinator: users['john.doe@example.com'] },
  ])
  return courseYears.reduce((acc, courseYear) => {
    // Find course name from ID
    const courseName = Object.keys(courses).find(name => courses[name] === courseYear.course_id)

    if (courseName) {
      acc[`${courseName} - ${courseYear.year_start}`] = courseYear.id
    }

    return acc
  }, {})
}

module.exports = { seedCourseYears }