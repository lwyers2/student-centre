const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const QualificationLevel = db.define('QualificationLevel' , {
  qualification: DataTypes.STRING,
  allowNull: false,
},
{
  tableName: 'qualification_level',
  timestaps: false
}
)

module.exports = QualificationLevel