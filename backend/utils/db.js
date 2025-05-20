require('dotenv').config()
const { Sequelize } = require('sequelize')

// determine environment and configure database
const env = process.env.NODE_ENV || 'development'

const databaseConfig = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    database: process.env.DB_NAME || 'student_marks',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    logging: false,
  },
  test: {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    database: process.env.TEST_DB_NAME || 'student_marks_test',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    logging: false,
  },
}

const config = databaseConfig[env]
const sequelize = new Sequelize(config.database, config.username, config.password, config)

// test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log(`Database connection to "${config.database}" has been established successfully.`)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

connectDB()

module.exports = sequelize
