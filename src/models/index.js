const { collection } = require('./db');

const User = collection('users');
const Category = collection('categories');
const Product = collection('products');
const ProductSku = collection('productSkus');
const CartItem = collection('cartItems');
const Order = collection('orders');
const OrderItem = collection('orderItems');
const Address = collection('addresses');
const Payment = collection('payments');
const Review = collection('reviews');
const Favorite = collection('favorites');

module.exports = {
  User,
  Category,
  Product,
  ProductSku,
  CartItem,
  Order,
  OrderItem,
  Address,
  Payment,
  Review,
  Favorite,
};
