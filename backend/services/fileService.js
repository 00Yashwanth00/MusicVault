const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create songs directory if it doesn't exist
const songsDir = path.join(__dirname, '../../songs');
if (!fs.existsSync(songsDir)) {
    fs.mkdirSync(songsDir, { recursive: true });
    console.log('Created songs directory:', songsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, songsDir);
    },
    filename: (req, file, cb) => {
        // Clean filename and create unique name
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + originalName;
        console.log('Saving file as:', filename);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('Received file details:');
    console.log('Original name:', file.originalname);
    console.log('MIME type:', file.mimetype);
    console.log('File size:', file.size);
    
    // Expanded list of allowed MIME types
    const allowedMimeTypes = [
        'audio/mpeg',           // MP3
        'audio/wav',            // WAV
        'audio/x-wav',          // Alternative WAV MIME type
        'audio/wave',           // Another WAV MIME type
        'audio/mp3',            // MP3 alternative
        'audio/m4a',            // M4A
        'audio/x-m4a',          // Alternative M4A
        'audio/aac',            // AAC
        'audio/flac',           // FLAC
        'audio/ogg',            // OGG
        'audio/webm'            // WEBM
    ];
    
    // Also check file extension as fallback
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg', '.webm'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        console.log('File type allowed:', file.mimetype, 'Extension:', fileExtension);
        cb(null, true);
    } else {
        console.log('File type rejected. MIME:', file.mimetype, 'Extension:', fileExtension);
        console.log('Allowed MIME types:', allowedMimeTypes);
        console.log('Allowed extensions:', allowedExtensions);
        cb(new Error(`Invalid file type. Allowed types: MP3, WAV, M4A, AAC, FLAC, OGG, WEBM. Received: ${file.mimetype} (${fileExtension})`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

console.log('File service configured. Upload directory:', songsDir);

module.exports = { upload };