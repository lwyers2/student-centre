const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const QualificationLevel = db.define('QualificationLevel' , {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'qualification_level',
  timestamps: false,
}
)

module.exports = QualificationLevel