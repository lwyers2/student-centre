//TODO:
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
const { seedUserSchools } = require('./seedUserSchools')
const { seedModules } = require('./seedModules')
const { seedSemesters } = require('./seedSemesters')
const { seedModuleYears } = require('./seedModuleYears')
const { seedModuleCourses } = require('./seedModuleCourses')
const { seedUserModules } = require('./seedUserModules')
const { seedStudents } = require('./seedStudents')
const { seedStudentCourses } = require('./seedStudentCourses')
const { seedStudentModules } = require('./seedStudentModules')

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
    await seedUserCourses(users, courseYears, courses)
    await seedUserSchools(users, schools)

    const modules = await seedModules()
    const semesters = await seedSemesters()
    const moduleYears = await seedModuleYears(modules, semesters, users)
    await seedModuleCourses(courses, courseYears, modules, moduleYears)
    await seedUserModules(users, modules, moduleYears)
    const students = await seedStudents()
    await seedStudentCourses(students, courses, courseYears)
    await seedStudentModules(students, modules, moduleYears)

    console.log('Test database seeded successfully')
  } catch (error) {
    console.error('Error seeding test database:', error)
    throw error // Ensure errors propagate
  }
}


module.exports = { populateTestDatabase }