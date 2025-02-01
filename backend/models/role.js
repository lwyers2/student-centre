const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Role = db.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
},
{
  tableName: 'role',
  timestamps: false
})

module.exports = Role