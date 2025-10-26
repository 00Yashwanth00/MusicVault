const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'music_system_fallback_secret_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

console.log('JWT Secret configured:', JWT_SECRET ? 'Yes' : 'No');

const generateToken = (user) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    const payload = {
        userId: user.user_id,
        email: user.email,
        isAdmin: user.is_admin
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

const verifyToken = (token) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };