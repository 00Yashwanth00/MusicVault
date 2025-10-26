const { searchSongs, getSongsByArtist, getSongsByAlbum, getSongsByPlaylist } = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.get('/songs', authenticateToken, searchSongs);
router.get('/artist', authenticateToken, getSongsByArtist);
router.get('/album', authenticateToken, getSongsByAlbum);
router.get('/playlist', authenticateToken, getSongsByPlaylist);

module.exports = router;