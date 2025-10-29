const pythonService = require('../services/pythonService.js');

const searchSongs = async (req, res) => {
    console.log("In searchSongs controller");
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
        console.log("Artist:", artist);
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
        const { playlist_id, user_id } = req.query;
        console.log("Playlist ID:", playlist_id);
        console.log("User ID:", user_id);
        if (!playlist_id) {
          return res.status(400).json({
            success: false,
            error: 'Playlist parameter is required'
          });
        }

        const result = await pythonService.getSongsByPlaylist(playlist_id, user_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
}


const getAllSongs = async (req, res) => {
    try {
        const result = await pythonService.getAllSongs();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { searchSongs, getSongsByAlbum, getSongsByArtist, getSongsByPlaylist, getAllSongs };