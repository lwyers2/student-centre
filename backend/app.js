const express = require('express')
const app = express()
require('express-async-errors') // Make async route handlers work
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

// Initialize Sequelize and connect to DB
require('./utils/db') // This will call the connection function in db.js

// Middleware setup
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// Routes (You can define your routes here later)

// Error handling middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
