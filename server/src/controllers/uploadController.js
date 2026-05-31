import path from 'path';
import multer from 'multer';
import AppError from '../utils/AppError.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set Storage Engine to Memory
const storage = multer.memoryStorage();

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Error: Images and Documents Only!', 400));
  }
}

// Init Upload
export const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload file
// @route   POST /api/v1/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  try {
    const isImage = req.file.mimetype.startsWith('image/');
    const timestamp = Date.now();
    let finalPath = '';
    let variants = {};

    if (isImage) {
      const filename = `${req.file.fieldname}-${timestamp}.webp`;
      const originalPath = path.join(uploadDir, filename);
      const mediumPath = path.join(uploadDir, `medium-${filename}`);
      const thumbPath = path.join(uploadDir, `thumb-${filename}`);

      // 1. Convert to WebP format, Resize to max 1920px width
      await sharp(req.file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(originalPath);

      // 2. Generate medium (800px)
      await sharp(req.file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mediumPath);

      // 3. Generate thumbnail (400px)
      await sharp(req.file.buffer)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      finalPath = `/uploads/${filename}`;
      variants = {
        original: finalPath,
        medium: `/uploads/medium-${filename}`,
        thumbnail: `/uploads/thumb-${filename}`
      };
    } else {
      // It's a document
      const filename = `${req.file.fieldname}-${timestamp}${path.extname(req.file.originalname)}`;
      const docPath = path.join(uploadDir, filename);
      fs.writeFileSync(docPath, req.file.buffer);
      finalPath = `/uploads/${filename}`;
    }

    res.status(200).json({
      success: true,
      data: finalPath,
      variants
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    next(new AppError('Image processing failed', 500));
  }
};
