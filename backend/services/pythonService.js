const axios = require('axios');
const baseURL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';

console.log('Python Backend URL:', baseURL);

const makeRequest = async (endpoint, data = null, method = 'post') => {
    try {
        const config = {
            method,
            url: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000
        };

        if (method.toLowerCase() === 'get' && data) {
            config.params = data;
        } else if (data) {
            config.data = data;
        }

        console.log(`Making ${method.toUpperCase()} request to: ${config.url}`);
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Python service error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error(`Python backend communication failed: ${error.message}`);
    }
}

// Auth methods
const register_user = async (userData) => {
    return await makeRequest('/users/register', userData);
}

const login_user = async (credentials) => {
    return await makeRequest('/users/login', credentials);
}

const register_admin = async (adminData) => {
    return await makeRequest('/admin/register', adminData);
}

const login_admin = async (credentials) => {
    return await makeRequest('/admin/login', credentials);
}
// Search methods
const searchSongs = async (title) => {
    return await makeRequest('/search/songs', { title }, 'get');
}

const getSongsByArtist = async (artist) => {
    return await makeRequest('/songs/artist', { artist }, 'get');
}

const getSongsByAlbum = async (album) => {
    return await makeRequest('/songs/album', { album }, 'get');
}

const getSongsByPlaylist = async (playlist_id, userId) => {
    return await makeRequest('/songs/playlist', { playlist_id, user_id: userId }, 'get');
}

// Play methods
const addPlayHistory = async (userId, songId) => {
    return await makeRequest('/play-history', { user_id: userId, song_id: songId });
}

// Admin methods
const addSong = async (songData) => {
    return await makeRequest('/admin/songs', songData);
}

const addArtist = async (artistData) => {
    return await makeRequest('/admin/artists', artistData);
}

const addAlbum = async (albumData) => {
    return await makeRequest('/admin/albums', albumData);
}


const addPlaylist = async (playlistData) => {
    return await makeRequest('/playlists', playlistData);
}


const addSongToPlaylist = async (data) => {
    return await makeRequest('/playlists/add-song', data);
}

const getAllPlaylists = async (userId) => {
    return await makeRequest('/playlists', { user_id: userId }, 'get');
}

const getAllSongs = async () => {
    return await makeRequest('/songs', null, 'get');
}


const getAllArtists = async () => {
    return await makeRequest('/artists', null, 'get');
}

module.exports = {
    register_user,
    login_user,
    register_admin,
    login_admin,
    searchSongs,
    getSongsByArtist,
    getSongsByAlbum,
    getSongsByPlaylist,
    addPlayHistory,
    addSong,
    addArtist,
    addAlbum,
    addPlaylist,
    addSongToPlaylist,
    getAllPlaylists,
    getAllSongs,
    getAllArtists
};