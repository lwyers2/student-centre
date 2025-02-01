const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const UserCourse = db.define('UserCourse', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'user_course',
  timestamps: false,
})

module.exports = UserCourse