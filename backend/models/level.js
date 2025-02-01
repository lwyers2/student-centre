const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Level = db.define('Level', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
},
{
  tableName: 'level',
  timestamps: false,
}
)

module.exports = Level