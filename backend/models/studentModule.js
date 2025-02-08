// studentModule.js
const { DataTypes } = require('sequelize')
const db = require('../utils/db')

// Define StudentModule model
const StudentModule = db.define('StudentModule', {
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
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  result: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flagged: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  module_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  resit: {
    type: DataTypes.TINYINT,
    allowNull: false,
  }
},
{
  tableName: 'student_module',
  timestamps: false
}
)

module.exports = StudentModule
