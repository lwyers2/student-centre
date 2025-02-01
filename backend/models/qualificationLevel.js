const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const QualificationLevel = db.define('QualificationLevel' , {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  tableName: 'qualification_level',
  timestaps: false
}
)

module.exports = QualificationLevel