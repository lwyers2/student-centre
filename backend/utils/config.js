require('dotenv').config()

const PORT = process.env.NODE_ENV === 'test' ? process.env.PORT_TEST : process.env.PORT


module.exports = {
  PORT
}