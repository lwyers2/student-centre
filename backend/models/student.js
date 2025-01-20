const { DataTypes } = require('sequelize')
const db = require('../utils/db')

// Define Student model
const Student = db.define('Student', {
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
  },
  student_code: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
{
  tableName: 'student',
  timestamps: false
}
)



module.exports = Student