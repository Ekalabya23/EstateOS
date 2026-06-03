import express from 'express';
import { pickUploadedFile, upload, uploadFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Accept the field names used across the app: file, image, photo, and document.
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  pickUploadedFile,
  uploadFile
);

export default router;
