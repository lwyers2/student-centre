const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Semester = db.define('Semester', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  tableName: 'semester',
  timestamps: false,
}
)

module.exports = Semester