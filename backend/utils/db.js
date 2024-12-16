require('dotenv').config()
const { Sequelize } = require('sequelize')

// Set up Sequelize connection
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false, // Disable query logging for now
})

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

connectDB()

module.exports = sequelize
