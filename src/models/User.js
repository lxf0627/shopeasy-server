const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true },
    phone: { type: DataTypes.STRING(20) },
    avatar: { type: DataTypes.STRING(500), defaultValue: '' },
    nickname: { type: DataTypes.STRING(50), defaultValue: '' },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    status: { type: DataTypes.ENUM('active', 'disabled'), defaultValue: 'active' },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
