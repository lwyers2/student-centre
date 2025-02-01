const { DataTypes } = require('sequelize')
const db = require('../utils/db')

// Define UserModule model
const UserModule = db.define('UserModule', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
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
