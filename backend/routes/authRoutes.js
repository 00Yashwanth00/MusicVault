const { registerUser, loginUser, getProfile, registerAdmin, loginAdmin } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const express = require('express');

const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;