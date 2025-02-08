//TODO:
// user_course
// user_school
// module
// semester
// module_year
// module_course
// user_module
// student
// student_course
// student_module

const { seedLevels } = require('./seedLevels')
const { seedClassifications } = require('./seedClassifications')
const { seedSchools } = require('./seedSchools')
const { seedQualificationLevels } = require('./seedQualificationLevels')
const { seedCourses } = require('./seedCourses')
const { seedRoles } = require('./seedRoles')
const { seedUsers } = require('./seedUsers')
const { seedCourseYears } = require('./seedCourseYears')
const { seedUserCourses } = require('./seedUserCourses')

async function populateTestDatabase() {
  try {
    console.log('Seeding test database...')
    const levels = await seedLevels()
    await seedClassifications(levels)
    const qualificationLevels = await seedQualificationLevels(levels)
    const schools = await seedSchools()
    const courses = await seedCourses(schools, qualificationLevels)
    const roles = await seedRoles()
    const users = await seedUsers(roles)
    const courseYears = await seedCourseYears(courses, users)
    console.log(courseYears)
    await seedUserCourses(users, courseYears, courses)
    console.log('Test database seeded successfully')
  } catch (error) {
    console.error('Error seeding test database:', error)
  }
}

module.exports = { populateTestDatabase }