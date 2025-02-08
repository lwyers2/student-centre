const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Level = db.define('Level', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
},
{
  tableName: 'level',
  timestamps: false,
}
)

module.exports = Level