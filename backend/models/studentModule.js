// studentModule.js
const { DataTypes } = require('sequelize')
const db = require('../utils/db')

// Define StudentModule model
const StudentModule = db.define('StudentModule', {
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  resit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'student_module',
  timestamps: false
}
)

module.exports = StudentModule
