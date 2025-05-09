const { seedLevels } = require('./seedLevels')
const { seedClassifications } = require('./seedClassifications')
const { seedSchools } = require('./seedSchools')
const { seedQualificationLevels } = require('./seedQualificationLevels')
const { seedRoles } = require('./seedRoles')
const { seedSemesters } = require('./seedSemesters')
const { seedResultDescriptors } = require('./seedResultDescriptors')

async function populateTestDatabase() {
  try {
    //this was once larger, but I reduced down
    console.log('Seeding test database...')
    const levels = await seedLevels()
    await seedClassifications(levels)
    await seedResultDescriptors()

    await seedQualificationLevels(levels)
    await seedSchools()

    await seedRoles()


    await seedSemesters()

    console.log('Test database seeded successfully')
  } catch (error) {
    console.error('Error seeding test database:', error)
    throw error
  }
}


module.exports = { populateTestDatabase }