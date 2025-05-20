require('./models/associations')
require('dotenv').config()
const app = require('./app')
const config = require('./utils/config')
const { info } = require('./utils/logger')
const sequelize = require('./utils/db')

// console.log(`Starting server on port: ${config.PORT}`)

// // Start the server
// app.listen(config.PORT, () => {
//   info(`Server running on port ${config.PORT}`)
// })

// Sync Sequelize models and then start the server
const startServer = async () => {
  try {
    // Sync the database and ensure all models are in place
    await sequelize.sync()
    console.log('Database synced successfully')

    // Start the server
    app.listen(config.PORT, () => {
      info(`Server running on port ${config.PORT}`)
    })
  } catch (error) {
    console.error('Error syncing database:', error)
  }
}

if (process.env.NODE_ENV !== 'test') {
  // Only start the server if not in test environment
  startServer()
} else {
  console.log('Test environment detected. Server not started.')
}