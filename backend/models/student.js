const { DataTypes } = require('sequelize')
const db = require('../utils/db')

// Define Student model
const Student = db.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  forename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  student_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
},
{
  tableName: 'student',
  timestamps: false
}
)



module.exports = Student