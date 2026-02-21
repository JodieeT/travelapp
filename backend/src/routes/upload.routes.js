const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safe = (file.originalname || '').replace(/[^a-zA-Z0-9.-]/g, '') || 'image';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${safe.slice(0, 20)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error('仅支持图片：JPEG、PNG、GIF、WebP'));
  },
});

router.post('/image', auth, role('merchant'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: '请选择图片文件' });
  const url = '/uploads/' + req.file.filename;
  return res.json({ url });
});

router.post('/images', auth, role('merchant'), (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: '单张图片不超过 5MB' });
      if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ message: '最多上传 10 张' });
      return res.status(400).json({ message: err.message || '上传失败' });
    }
    next();
  });
}, (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: '请选择图片文件' });
  const urls = req.files.map((f) => '/uploads/' + f.filename);
  return res.json({ urls });
});

module.exports = router;
