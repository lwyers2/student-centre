const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Classification = db.define('Classification' , {
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
},
{
  tableName: 'classification',
  timestamps: false
})

module.exports = Classification