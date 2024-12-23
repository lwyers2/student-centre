const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Level = db.define('Level', {
  level: DataTypes.INTEGER,
  allowNull: false,
},
{
  tableName: 'level',
  timestamps: false,
}
)

module.exports = Level