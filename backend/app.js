const express = require('express')
const app = express()
require('express-async-errors') // Make async route handlers work
const cors = require('cors')
const middleware = require('./utils/middleware')
const studentsRouter = require('./controllers/student')
const coursesRouter = require('./controllers/course')


// Initialize Sequelize and connect to DB
require('./utils/db') // This will call the connection function in db.js



// Middleware setup
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// Routes 
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)

// Error handling middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
