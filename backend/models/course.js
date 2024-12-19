const { DataTypes } = require('sequelize')
const db = require('../utils/db')

//Define Course model
const Course = db.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type:DataTypes.STRING,
    allowNull: false
  },
},
  {
    tableName: 'course',
    timeStamps: false
  }
)



module.exports = Course;