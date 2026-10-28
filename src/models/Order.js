const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderNo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'shipped', 'received', 'completed', 'cancelled', 'refunding', 'refunded'),
      defaultValue: 'pending',
    },
    addressSnapshot: { type: DataTypes.TEXT, defaultValue: '{}' },
    remark: { type: DataTypes.STRING(500), defaultValue: '' },
    payTime: { type: DataTypes.DATE },
    shipTime: { type: DataTypes.DATE },
    receiveTime: { type: DataTypes.DATE },
    couponId: { type: DataTypes.INTEGER },
    discountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  }, {
    tableName: 'orders',
    timestamps: true,
  });

  return Order;
};
