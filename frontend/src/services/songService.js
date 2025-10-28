import api from './api';

export const songService = {
  // Add new song with file upload
  addSong: async (songData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields to FormData
      formData.append('title', songData.title);
      formData.append('duration', songData.duration);
      formData.append('genre', songData.genre);
      formData.append('artistname', songData.artist_name);
      formData.append('audio', songData.audio_file); // The actual file

      const response = await api.post('/api/admin/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add song');
    }
  },

  // Search songs by title
  searchSongs: async (title) => {
    try {
      const response = await api.get(`/api/search/songs?title=${encodeURIComponent(title)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to search songs');
    }
  },

  // Get songs by artist (for future use)
  getSongsByArtist: async (artist) => {
    try {
      const response = await api.get(`/api/search/artist?artist=${encodeURIComponent(artist)}`);
      // const response = await api.get(`/api/songs/artist?artist=${encodeURIComponent(artist)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch songs by artist');
    }
  },

  // Get songs by album (for future use)
  getSongsByAlbum: async (album) => {
    try {
      const response = await api.get(`/api/songs/album?album=${encodeURIComponent(album)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch songs by album');
    }
  },

  // Get all artists for dropdown
  getArtists: async () => {
    try {
      // Since there's no direct artists endpoint, we'll handle this differently
      return { success: true, data: [{ artist_id: 1, artistname: 'Yashwanth R' }, { artist_id: 2, artistname: 'TestArtist2' }] };
    } catch (error) {
      throw new Error('Failed to fetch artists');
    }
  },
};