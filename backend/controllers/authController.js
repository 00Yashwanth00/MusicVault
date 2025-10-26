const pythonService = require('../services/pythonService');
const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { username, email, password, is_admin, admin_name } = req.body;

        const result = await pythonService.register({
            username,
            email,
            password,
            is_admin: is_admin || false,
            admin_name: admin_name || ''
        });

        if(!result.success) {
            return res.status(400).json(result);
        }

        const user = {
            user_id: result.user_id,
            username,
            email,
            is_admin: is_admin || false
        };

        const token = authService.generateToken(user);

        res.json({  // Fixed: was return json() instead of res.json()
            success: true,
            token,
            user
        });
    } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pythonService.login({ email, password });

        if (!result.success) {
            return res.status(401).json(result);
        }

        const token = authService.generateToken(result.user);

        res.json({
            success: true,
            token,
            user: result.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

const getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { register, login, getProfile };