const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const UserSchool = db.define('UserSchool', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  school_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'user_school',
  timestamps: false,
}
)

module.exports = UserSchool