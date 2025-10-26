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
const register = async (userData) => {
    return await makeRequest('/register', userData);
}

const login = async (credentials) => {
    return await makeRequest('/login', credentials);
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

const getSongsByPlaylist = async (playlist, userId) => {
    return await makeRequest('/songs/playlist', { playlist, user_id: userId }, 'get');
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

module.exports = {
    register,
    login,
    searchSongs,
    getSongsByArtist,
    getSongsByAlbum,
    getSongsByPlaylist,
    addPlayHistory,
    addSong,
    addArtist,
    addAlbum
};