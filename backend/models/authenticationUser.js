const { DataTypes, BOOLEAN } = require('sequelize')
const db = require('../utils/db')

const AuthenticationUser = db.define('AuthenticationUser', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expires_at:{
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_active: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
},
{
  tableName: 'authentication_user',
  timestamps: false,
})

module.exports = AuthenticationUser