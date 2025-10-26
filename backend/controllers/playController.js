const pythonService = require('../services/pythonService.js');

module.exports.addToHistory = async (req, res) => {
    try {
        const { songId } = req.body;
        const userId = req.user.userId;

        if (!songId) {
            return res.status(400).json({
            success: false,
            error: 'Song ID is required'
            });
        }

        const result = await pythonService.addPlayHistory(userId, songId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}