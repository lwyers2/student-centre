require('../models/associations')
const sequelize = require('../utils/db')
const { populateTestDatabase } = require('../helper/seeders')

beforeAll(async () => {
  console.log('Dropping all tables...')
  try {
    // Disable foreign key checks to avoid constraint issues during drop
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    // Drop the database (make sure to sync after)
    await sequelize.drop()

    // Re-enable foreign key checks after drop
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

    // Sync database with force: true to re-create tables
    await sequelize.sync({ force: true })

    // Populate the database with necessary test data
    await populateTestDatabase() // Ensure that seeding is asynchronous and completes properly

  } catch (error) {
    console.error('Error syncing database:', error)
    throw error // Stop execution if there's an issue
  }
})

afterAll(async () => {
  console.log('Waiting before closing DB...')
  await sequelize.close() // Ensure DB connection is properly closed
  console.log('DB connection closed.')
})
