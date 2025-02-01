const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const School = db.define('School', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  school_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  tableName: 'school',
  timestamps: false
}
)


module.exports = School