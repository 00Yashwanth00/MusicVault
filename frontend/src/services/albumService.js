import api from './api';

export const albumService = {
    // Add new album
    addAlbum: async (albumData) => {
        try {
        const response = await api.post('/api/admin/albums', albumData);
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add album');
        }
    },

    // Get available artists (we'll need to create a backend endpoint for this)
    getArtists: async () => {
        try {
        // For now, we'll return empty array - in real app, fetch from backend
        return { success: true, data: [] };
        } catch (error) {
        throw new Error('Failed to fetch artists');
        }
    },

    // Get available songs (we'll need to create a backend endpoint for this)
    getSongs: async () => {
        try {
        // For now, we'll return empty array - in real app, fetch from backend
        return { success: true, data: [] };
        } catch (error) {
        throw new Error('Failed to fetch songs');
        }
    }
};