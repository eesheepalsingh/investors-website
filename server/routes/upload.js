const express = require('express');
const multer = require('multer');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

function uploadHandler(bucket, allowedMime) {
  return async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      if (allowedMime && !allowedMime.some((p) => req.file.mimetype.startsWith(p))) {
        return res.status(400).json({ error: `Invalid file type: ${req.file.mimetype}` });
      }

      const ext = (req.file.originalname.split('.').pop() || 'bin').toLowerCase();
      const safeBase = req.file.originalname
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-z0-9_-]+/gi, '-')
        .slice(0, 40) || 'file';
      const key = `${Date.now()}-${safeBase}.${ext}`;

      const { error: upErr } = await supabaseAdmin.storage
        .from(bucket)
        .upload(key, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });
      if (upErr) return res.status(400).json({ error: upErr.message });

      const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(key);
      res.status(201).json({ url: data.publicUrl, path: key, bucket });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Upload failed' });
    }
  };
}

router.post(
  '/logo',
  requireAuth,
  upload.single('file'),
  uploadHandler('logos', ['image/'])
);

router.post(
  '/pitch-deck',
  requireAuth,
  upload.single('file'),
  uploadHandler('pitch-decks', ['application/pdf'])
);

router.post(
  '/founder-photo',
  requireAuth,
  upload.single('file'),
  uploadHandler('founder-photos', ['image/'])
);

module.exports = router;
