const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Course = db.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  years: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    tableName: 'course',
    timestamps: false
  }
)



module.exports = Course;