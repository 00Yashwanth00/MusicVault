import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playService } from '../../services/playService';
import '../../styles/Playlist.css';

const UserPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();


  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        console.log("Inside fetchPlaylists");
        console.log(user);
        const response = await playService.getAllPlaylists(user.user_id);
        console.log(response);
        console.log(user);
        if (response.success) {
          console.log("Playlists fetched successfully");
          console.log(response.playlists);
          setPlaylists(response.playlists || []);
        } else {
          setError(response.error || 'Failed to load playlists');
        }
      } catch (err) {
        setError('Failed to load playlists: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  if (loading) return <div className="loading">Loading playlists...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="playlists-container">
      <div className="playlists-header">
        <h1>My Playlists</h1>
        <p>Manage your music collections</p>
        {playlists.length > 0 && (
          <Link to="/user/create-playlist" className="create-playlist-btn">
            Create New Playlist
          </Link>
        )}
      </div>

      <div className="playlists-grid">
        {playlists.map(playlist => (
          <div key={playlist.playlist_id} className="playlist-card">
            <div className="playlist-info">
              <h3>{playlist.name}</h3>
              <p className="playlist-description">{playlist.description}</p>
              <p className="song-count">{playlist.song_count || 0} songs</p>
            </div>
            <div className="playlist-actions">
              <Link 
                to={`/user/playlist/${playlist.playlist_id}`}
                className="action-btn view-btn"
              >
                View Songs
              </Link>
              <Link 
                to={`/user/add-to-playlist/${playlist.playlist_id}`}
                className="action-btn add-btn"
              >
                Add Songs
              </Link>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="empty-state">
          <h3>No playlists yet</h3>
          <p>Create your first playlist to organize your music</p>
          <Link to="/user/create-playlist" className="create-playlist-btn">
            Create Your First Playlist
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserPlaylists;