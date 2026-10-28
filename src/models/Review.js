const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    content: { type: DataTypes.TEXT, defaultValue: '' },
    images: { type: DataTypes.TEXT, defaultValue: '[]' },
  }, {
    tableName: 'reviews',
    timestamps: true,
  });

  return Review;
};
