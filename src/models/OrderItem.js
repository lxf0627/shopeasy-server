const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    productName: { type: DataTypes.STRING(200), defaultValue: '' },
    productImage: { type: DataTypes.STRING(500), defaultValue: '' },
  }, {
    tableName: 'order_items',
    timestamps: false,
  });

  return OrderItem;
};
