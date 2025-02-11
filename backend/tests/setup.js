require('../models/associations')
const sequelize = require('../utils/db')
const { populateTestDatabase } = require('../helper/seeders')

beforeAll(async () => {
  console.log('Dropping all tables...')
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    await sequelize.drop()
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    await sequelize.sync({ force: true })

    await populateTestDatabase() // Runs all seeders
  } catch (error) {
    console.error('Error syncing database:', error)
    throw error // Stop execution if there's an issue
  }
})


afterAll(async () => {
  console.log('Waiting before closing DB...')
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Small delay
  await sequelize.close()
  console.log('DB connection closed.')
})
