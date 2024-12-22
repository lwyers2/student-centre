const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const School = db.define('School', {
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