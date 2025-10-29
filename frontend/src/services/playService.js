import api from "./api";

export const playService = {
    createPlaylist: async ({ user_id, name, description }) => {
        try {
            const response = await api.post(
                '/api/play/playlist',
                {
                    user_id,
                    name,
                    description
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to create playlist');
        }
    },

    addSongToPlaylist: async ({ playlistId, songId }) => {
        try {
            const response = await api.post(`/api/play/playlist/add-song`, {
                playlistId,
                songId
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to add song to playlist');
        }
    },

    getAllPlaylists: async (user_id) => {
        try {
            const response = await api.get(`/api/play/playlists?user_id=${encodeURIComponent(user_id)}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch playlists');
        }
    },

    getPlaylistSongs: async (playlist_id, user_id) => {
        try {
            const response = await api.get(
                `/api/search/playlist?playlist_id=${encodeURIComponent(playlist_id)}&user_id=${encodeURIComponent(user_id)}`
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch playlist songs');
        }
    }
};