const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    icon: { type: DataTypes.STRING(255), defaultValue: '' },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  return Category;
};
