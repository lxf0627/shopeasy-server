const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    originalPrice: { type: DataTypes.DECIMAL(10, 2) },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    salesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    images: { type: DataTypes.TEXT, defaultValue: '[]' }, // JSON array
    categoryId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('on', 'off'), defaultValue: 'on' },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 5.0 },
  }, {
    tableName: 'products',
    timestamps: true,
  });

  return Product;
};
