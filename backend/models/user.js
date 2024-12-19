const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const User = db.define('User', {
  forename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  { 
    tableName: 'user',
    timeStamps: false
  }
)

module.exports = User;