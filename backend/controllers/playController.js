const pythonService = require('../services/pythonService.js');

const addToHistory = async (req, res) => {
    try {
        const { song_id, user_id } = req.body;

        console.log('Adding to history:', { user_id, song_id });

        if (!song_id) {
            return res.status(400).json({
            success: false,
            error: 'Song ID is required'
            });
        }

        const result = await pythonService.addPlayHistory(user_id, song_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

const createPlaylist = async (req, res) => {
    // Implementation for creating a playlist
    try {
        const { name, user_id, description } = req.body;
        // Validate input
        if (!name || !user_id) {
            return res.status(400).json({
                success: false,
                error: 'Name and User ID are required'
            });
        }
        // Call to pythonService to create playlist
        const result = await pythonService.addPlaylist({ name, user_id, description });
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        if (!playlistId || !songId) {
            return res.status(400).json({
                success: false,
                error: 'Playlist ID and Song ID are required'
            });
        }

        const result = await pythonService.addSongToPlaylist({ playlist_id: playlistId, song_id: songId });
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const getAllPlaylists = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pythonService.getAllPlaylists(userId);
        console.log('Fetched playlists:', result);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const getAllArtists = async (req, res) => {
    try {
        const result = await pythonService.getAllArtists();
        res.json({
            success: true,
            artists: result.artists
        });

        console.log('Fetched artists:', result.artists);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}





module.exports = {
    addToHistory,
    createPlaylist,
    addSongToPlaylist,
    getAllPlaylists,
    getAllArtists
};