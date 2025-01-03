const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Role = db.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
},
{
  tableName: 'role',
  timestamps: false
})

module.exports = Role