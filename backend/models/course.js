const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const Course = db.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  school_id : {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  years: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qualification_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  part_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  tableName: 'course',
  timestamps: false
}
)

module.exports = Course