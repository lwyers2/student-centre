require('./models/associations')
require('dotenv').config()
const app = require('./app') // Import app.js
const config = require('./utils/config') // Get port from config
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
    await sequelize.sync()  // You can optionally add { force: true } for re-syncing
    console.log('Database synced successfully')
    console.log(sequelize.models)

    // Now that the DB is synced, start the server
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