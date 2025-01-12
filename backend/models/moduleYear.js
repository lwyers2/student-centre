const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const ModuleYear = db.define('ModuleYear', {
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year_start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  tableName: 'module_year',
  timestamps: false,
})

module.exports = ModuleYear