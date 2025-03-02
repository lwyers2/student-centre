const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const ModuleCourse = db.define('ModuleCourse', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  required: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: false
  }
},
{
  tableName: 'module_course',
  timestamps: false,
})

module.exports = ModuleCourse