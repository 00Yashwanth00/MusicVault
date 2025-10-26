const express = require('express');
const { addToHistory } = require('../controllers/playController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/history', authenticateToken, addToHistory);

module.exports = router;
