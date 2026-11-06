const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { checkPasswordLength, checkNameLength } = require('../utils/userValidation');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      checkPasswordLength
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: checkNameLength
  }
});

module.exports = { User, checkPasswordLength, checkNameLength };
