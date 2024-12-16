const app = require('./app') // Import app.js
const config = require('./utils/config') // Get port from config
const { info } = require('./utils/logger')

// Start the server
app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})
