const pythonService = require('../services/pythonService.js');

const searchSongs = async (req, res) => {
    try {
        const { title } = req.query;
      
        if (!title) {
            return res.status(400).json({
            success: false,
            error: 'Title parameter is required'
            });
        }

        const result = await pythonService.searchSongs(title);
      res.json(result);
    } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
}

const getSongsByArtist = async (req, res) => {
    try {
        const { artist } = req.query;
        if (!artist) {
            return res.status(400).json({
              success: false,
              error: 'Artist parameter is required'
            });
        }

        const result = await pythonService.getSongsByArtist(artist);
        res.json(result);
    } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
}


const getSongsByAlbum = async (req, res) => {
    try {
        const { album } = req.query;
      
        if (!album) {
            return res.status(400).json({
            success: false,
            error: 'Album parameter is required'
            });
        }

        const result = await pythonService.getSongsByAlbum(album);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const getSongsByPlaylist = async (req, res) => {
    try {
        const { playlist } = req.query;
        const userId = req.user.userId;
        
        if (!playlist) {
          return res.status(400).json({
            success: false,
            error: 'Playlist parameter is required'
          });
        }
  
        const result = await pythonService.getSongsByPlaylist(playlist, userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
}

module.exports = { searchSongs, getSongsByAlbum, getSongsByArtist, getSongsByPlaylist };