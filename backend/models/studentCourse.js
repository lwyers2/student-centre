const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const StudentCourse = db.define('StudentCourse', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  student_id: {
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
  },
  archived: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
},
{
  tableName: 'student_course',
  timestamps: false
})

module.exports = StudentCourse