// models/meeting.js
const { DataTypes } = require('sequelize')
const db = require('../utils/db')


const Meeting = db.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  academic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  admin_staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  outcome: {
    type: DataTypes.STRING,
    defaultValue: 'PEN',
  },
  meeting_reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  module_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  path_to_minutes: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'meeting', // specify the table name
  timestamps: false,    // disable timestamps if not present in your table
})

module.exports = Meeting
