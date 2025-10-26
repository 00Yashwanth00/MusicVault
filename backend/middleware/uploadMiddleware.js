const { upload } = require('../services/fileService.js');

const handleFileUpload = (fieldName) => {
  return (req, res, next) => {
    // Use Multer's single file upload
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, function (err) {
      if (err) {
        console.error('File upload error:', err.message);
        return res.status(400).json({ 
          success: false, 
          error: err.message 
        });
      }
      
      // Check if file was actually uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: `No file uploaded for field: ${fieldName}`
        });
      }
      
      console.log('File uploaded successfully:', req.file);
      next();
    });
  };
};

module.exports = { handleFileUpload };