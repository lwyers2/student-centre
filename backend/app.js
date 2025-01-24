const express = require('express')
const app = express()
require('express-async-errors') // Make async route handlers work
const cors = require('cors')
const requestLogger  = require('./middleware/requestLogger')
const errorHandler  = require('./middleware/errorHandler')
const unknownEndpoint  = require('./middleware/unkownEndpoint')
const studentsRouter = require('./controllers/student')
const coursesRouter = require('./controllers/course')
const modulesRouter = require('./controllers/module')
const classificationsRouter = require('./controllers/classification')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const protectedRouter = require('./controllers/protected')


// Initialize Sequelize and connect to DB
require('./utils/db') // This will call the connection function in db.js



// Middleware setup
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

// Routes
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/modules', modulesRouter)
app.use('/api/users', usersRouter)
app.use('/api/classifications', classificationsRouter)
app.use('/api/login', loginRouter)
app.use('/api/protected', protectedRouter)

// Error handling middleware
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
