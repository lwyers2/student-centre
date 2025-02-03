require('../models/associations')
const sequelize = require('../utils/db')
const { log } = require('../utils/logger')
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
  }
})

afterAll(async () => {
  // Close the DB connection after tests are done
  await sequelize.close()
})
