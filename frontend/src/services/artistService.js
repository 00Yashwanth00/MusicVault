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
      // For now, return mock data or empty array
      // In production, you'd call: const response = await api.get('/api/artists');
      return { 
        success: true, 
        data: [
          // Mock data for testing - remove when backend endpoint is ready
          { artist_id: 1, artistname: 'Yashwanth R' }
        ] 
      };
    } catch (error) {
      throw new Error('Failed to fetch artists');
    }
  }
};