const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
    //Will add validation at some point
    // validate: {
    //   isEmail: true
    // }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  date_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  prefix: {
    type: DataTypes.STRING,
  },
  job_title: {
    type: DataTypes.STRING,
  },
},
{
  tableName: 'user',
  timestamps: false
}
)

module.exports = User