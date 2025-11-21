const pythonService = require('../services/pythonService');

const addSong = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No audio file uploaded'
            });
        }
        const { title, duration, genre, artistname } = req.body;
        console.log(artistname);
        const file_path = req.file.filename;

        if (!title || !duration || !genre || !artistname) {
            return res.status(400).json({
            success: false,
            error: 'All fields are required: title, duration, genre, artistname'
            });
        }

        const result = await pythonService.addSong({
            title,
            duration: parseInt(duration),
            genre,
            file_path,
            artist_name: artistname
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
}

const addArtist = async (req, res) => { 
    try {
        const { artistname, bio } = req.body;

        if (!artistname) {
            return res.status(400).json({
            success: false,
            error: 'Artist name is required'
            });
        }

        const result = await pythonService.addArtist({
            artistname,
            bio: bio || ''
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const addAlbum = async (req, res) => {
    try {
        const { title, artist_id, songs } = req.body;
  
        if (!title || !artist_id || !songs || !Array.isArray(songs)) {
          return res.status(400).json({
            success: false,
            error: 'Title, artist_id, and songs array are required'
          });
        }
  
        const result = await pythonService.addAlbum({
          title,
          artist_id: parseInt(artist_id),
          songs
        });
  
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
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


module.exports = { addAlbum, addArtist, addSong, getAllArtists };