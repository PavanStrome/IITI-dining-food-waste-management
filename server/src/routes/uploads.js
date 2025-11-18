import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const result = await uploadToCloudinary(req.file);
    return res.status(201).json({ url: result.secure_url });
  } catch (err) {
    return res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;







