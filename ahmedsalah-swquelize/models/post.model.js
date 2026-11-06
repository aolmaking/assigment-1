const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Post extends Model {}

Post.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'Post',
  timestamps: true,
  paranoid: true
});

module.exports = { Post };
