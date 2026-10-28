const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, requireAdmin } = require('../middlewares/auth');
const { success, fail } = require('../utils/response');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('只支持图片文件 (jpg/png/gif/webp/svg)'));
    }
  },
});

// POST /api/upload/image — upload single image (admin only)
router.post('/image', authenticate, requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return fail(res, '请选择文件');
  const url = `/uploads/products/${req.file.filename}`;
  success(res, { url, filename: req.file.filename }, '上传成功');
});

module.exports = router;
