const pythonService = require('../services/pythonService');
const authService = require('../services/authService');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const result = await pythonService.register_user({
            username,
            email,
            password
        });

        if(!result.success) {
            return res.status(400).json(result);
        }

        const user = {
            user_id: result.user_id,
            username,
            email
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pythonService.login_user({ email, password });

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

const loginAdmin = async (req, res) => {
    try {
        const { admin_id, email, password } = req.body;

        const result = await pythonService.login_admin({ admin_id, email, password });

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

const registerAdmin = async (req, res) => {
    console.log('Register Admin called');
    try {
        const { username, email, password, admin_id } = req.body;
        console.log(password);
        const result = await pythonService.register_admin({
            username,
            email,
            password,
            admin_id
        });

        if(!result.success) {
            return res.status(400).json(result);
        }

        const admin = {
            admin_id: result.admin_id,
            username,
            email
        };

        const token = authService.generateToken(admin);

        res.json({
            success: true,
            token,
            admin
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

module.exports = { registerUser, loginUser, getProfile, registerAdmin, loginAdmin };