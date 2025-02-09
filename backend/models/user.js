const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const User = db.define('User', {
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
    validate: {
      // Custom email validation using a regular expression
      isCustomEmail(value) {
        const regex = /^[a-zA-Z0-9._%+-]+@(ads\.qub\.ac\.uk|qub\.ac\.uk)$/
        if (!regex.test(value)) {
          throw new Error('Email must be in the format x@ads.qub.ac.uk or x@qub.ac.uk')
        }
      },
    },
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
    allowNull: false,
  },
  job_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  tableName: 'user',
  timestamps: false
}
)

module.exports = User