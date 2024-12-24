const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Token = db.define('Token', {
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
},
{
  tableName: 'authentication_user',
  timestamps: false,
})

module.exports = Token