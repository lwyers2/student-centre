const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Semester = db.define('Semester', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
},
{
  tableName: 'semester',
  timestamps: false,
}
)

module.exports = Semester