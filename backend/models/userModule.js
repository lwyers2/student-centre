const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const UserModule = db.define('UserModule', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  tableName: 'user_module',
  timestamps: false
}
)

module.exports = UserModule
