const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    province: { type: DataTypes.STRING(50), allowNull: false },
    city: { type: DataTypes.STRING(50), allowNull: false },
    district: { type: DataTypes.STRING(50), allowNull: false },
    detail: { type: DataTypes.STRING(200), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'addresses',
    timestamps: true,
  });

  return Address;
};
