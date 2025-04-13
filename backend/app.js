const express = require('express')
const app = express()
require('express-async-errors') // Make async route handlers work
const cors = require('cors')
const requestLogger  = require('./middleware/requestLogger')
const errorHandler  = require('./middleware/errorHandler')
const unknownEndpoint  = require('./middleware/unkownEndpoint')
const path = require('path')
const studentsRouter = require('./controllers/student')
const coursesRouter = require('./controllers/course')
const modulesRouter = require('./controllers/module')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const letterRouter = require('./controllers/letter')
const meetingRouter = require('./controllers/meeting')
const fileDownloadRouter = require('./controllers/download')
const qualificationsRouter = require('./controllers/qualifications')
const rolesRouter = require('./controllers/role')
const schoolsRouter = require('./controllers/school')
const resetPasswordRouter = require('./controllers/resetPassword')
const uploadRouter = require('./controllers/upload')


// Initialize Sequelize and connect to DB
require('./utils/db') // This will call the connection function in db.js



// Middleware setup
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/modules', modulesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/letters', letterRouter)
app.use('/api/meetings', meetingRouter)
app.use('/api/download', fileDownloadRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/qualifications', qualificationsRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/schools', schoolsRouter)
app.use('/api/reset-password', resetPasswordRouter)

// Error handling middleware
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
