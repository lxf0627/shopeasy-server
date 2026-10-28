const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    method: { type: DataTypes.ENUM('alipay', 'wechat', 'balance'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'success', 'failed'), defaultValue: 'pending' },
    paidAt: { type: DataTypes.DATE },
  }, {
    tableName: 'payments',
    timestamps: true,
  });

  return Payment;
};
