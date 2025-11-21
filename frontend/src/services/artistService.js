import api from './api';

export const artistService = {
  // Add new artist
  addArtist: async (artistData) => {
    try {
      const response = await api.post('/api/admin/artists', artistData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add artist');
    }
  },

  // Get all artists - we'll need to create a backend endpoint for this
  getArtists: async () => {
    try {
      const response = await api.get('/api/play/artists');
      console.log('Fetched artists:', response.data.artists);
      return { 
        success: response.data.success,
        artists: response.data.artists
      };
    } catch (error) {
      throw new Error('Failed to fetch artists');
    }
  }
};