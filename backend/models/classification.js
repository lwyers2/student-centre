const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Classification = db.define('Classification' , {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  range_start: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  range_end: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'classification',
  timestamps: false
})

module.exports = Classification