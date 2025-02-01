const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const ModuleYear = db.define('ModuleYear', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year_start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_coordinator: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'module_year',
  timestamps: false,
})

module.exports = ModuleYear