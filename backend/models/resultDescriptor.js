const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const ResultDescriptor = db.define('ResultDescriptor' , {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  descriptor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  tableName: 'result_descriptor',
  timestamps: false,
}
)

module.exports = ResultDescriptor