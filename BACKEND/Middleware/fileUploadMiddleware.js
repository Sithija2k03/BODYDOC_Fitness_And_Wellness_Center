// BACKEND/middlewares/fileUploadMiddleware.js
const multer = require('multer');

// Configure multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where the uploaded file will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Save the file with a unique name (timestamp)
  },
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).single('file'); // Handle single file uploads

// Export multer middleware function
module.exports = upload;
