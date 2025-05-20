const { DataTypes } = require('sequelize')
const db = require('../utils/db')


const Letter = db.define('Letter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_sent: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  authorised: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sent_by_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  authorised_by_staff: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'letter',
  timestamps: false,
})

module.exports = Letter
