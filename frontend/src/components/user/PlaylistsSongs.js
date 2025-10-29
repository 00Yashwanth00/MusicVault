import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playService } from '../../services/playService';
import '../../styles/Playlist.css';

const PlaylistSongs = () => {
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { playlistId } = useParams();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      try {
        console.log("User ID:", user.user_id);
        console.log("Playlist ID:", playlistId);
        const response = await playService.getPlaylistSongs(playlistId, user.user_id);
        
        if (response.success) {
          setSongs(response.songs);
          console.log(response.songs.length)
          // Set playlist name from the first song or use a default
          if (response.songs.length > 0) {
            setPlaylistName(response.songs[0].playlist_name || 'My Playlist');
          } else {
            // If no songs, we need to get playlist info separately
            setPlaylistName('My Playlist');
          }
        } else {
          setError(response.error || 'Failed to load playlist songs');
        }
      } catch (err) {
        setError('Failed to load playlist songs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistSongs();
  }, [playlistId, user]);

  const handlePlaySong = (songId) => {
    // Implement play functionality
    console.log('Playing song:', songId);
  };

  if (loading) return <div className="loading">Loading songs...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="playlist-songs-container">
      <div className="playlist-header">
        <Link to="/user/playlists" className="back-link">← Back to Playlists</Link>
        <h1>{playlistName}</h1>
        <p>{songs.length} songs</p>
      </div>

      <div className="songs-list">
        {songs.map((song, index) => (
          <div key={song.song_id} className="song-item">
            <div className="song-info">
              <span className="song-number">{index + 1}</span>
              <div className="song-details">
                <h4 className="song-title">{song.title}</h4>
                <p className="song-artist">{song.artistname}</p>
              </div>
            </div>
            <div className="song-actions">
              <span className="song-duration">{song.duration}</span>
              <button 
                onClick={() => handlePlaySong(song.song_id)}
                className="play-btn"
              >
                ▶ Play
              </button>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="empty-state">
          <h3>No songs in this playlist</h3>
          <p>Add some songs to get started</p>
          <Link 
            to={`/user/add-to-playlist/${playlistId}`}
            className="add-songs-btn"
          >
            Add Songs to Playlist
          </Link>
        </div>
      )}
    </div>
  );
};

export default PlaylistSongs;