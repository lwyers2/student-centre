const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Module = db.define('Module', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CATs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  tableName: 'module',
  timestamps: false
})

module.exports = Module