const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const { notFound } = require('./utils/response');

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/addresses', require('./routes/address'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/favorites', require('./routes/favorite'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => res.json({ code: 200, message: 'ok', data: { uptime: process.uptime() } }));

// 404 — no route matched
app.use((req, res) => notFound(res, '接口不存在'));

// Error handler
app.use(errorHandler);

// Start
app.listen(config.port, () => {
  console.log(`ShopEasy server running at http://localhost:${config.port}`);
});