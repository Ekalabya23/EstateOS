import express from 'express';
import { upload, uploadFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow uploading multiple types of files: images, documents, floorPlans
router.post('/', protect, upload.single('file'), uploadFile);

export default router;
