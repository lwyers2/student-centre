const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const ModuleCourse = db.define('ModuleCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  }
},
{
  tableName: 'module_course',
  timestamps: false,
})

module.exports = ModuleCourse