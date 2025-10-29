const { searchSongs, getSongsByArtist, getSongsByAlbum, getSongsByPlaylist, getAllSongs } = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.get('/songs', authenticateToken, searchSongs);
router.get('/artist', authenticateToken, getSongsByArtist);
router.get('/album', authenticateToken, getSongsByAlbum);
router.get('/playlist', authenticateToken, getSongsByPlaylist);
router.get('/all-songs', authenticateToken, getAllSongs);

module.exports = router;