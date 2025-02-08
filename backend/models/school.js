const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const School = db.define('School', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  school_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
},
{
  tableName: 'school',
  timestamps: false
}
)


module.exports = School