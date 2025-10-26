const express = require('express');
const { addSong, addArtist, addAlbum } = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const { handleFileUpload } = require('../middleware/uploadMiddleware.js');

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/songs', handleFileUpload('audio'), addSong);
router.post('/artists', addArtist);
router.post('/albums', addAlbum);

module.exports = router;