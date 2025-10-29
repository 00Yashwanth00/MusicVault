const express = require('express');
const { addToHistory, createPlaylist, addSongToPlaylist, getAllPlaylists, getAllArtists } = require('../controllers/playController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/history', authenticateToken, addToHistory);
router.post('/playlist', authenticateToken, createPlaylist);
router.post('/playlist/add-song', authenticateToken, addSongToPlaylist);
router.get('/playlists', authenticateToken, getAllPlaylists);
router.get('/artists', authenticateToken, getAllArtists);

module.exports = router;
