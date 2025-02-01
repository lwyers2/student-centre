const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const CourseYear = db.define('CourseYear', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year_start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year_end: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_coordinator: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'course_year',
  timestamps: false,
}
)

module.exports = CourseYear