const { DataTypes } = require('sequelize')
const db = require('../utils/db')


const LetterType = db.define('LetterTypes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'letter_types',
  timestamps: false,
})

module.exports = LetterType