import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playService } from '../../services/playService';
import { songService } from '../../services/songService';
import AudioPlayer from '../common/AudioPlayer';
import '../../styles/Playlist.css';

const PlaylistSongs = () => {
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  const { user } = useAuth();
  const { playlistId } = useParams();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      try {
        console.log(user);
        console.log("User ID:", user.user_id);
        console.log("Playlist ID:", playlistId);
        const response = await playService.getPlaylistSongs(playlistId, user.user_id);
        
        if (response.success) {
          // Add audio_url to each song
          const songsWithAudioUrl = response.songs.map(song => ({
            ...song,
            audio_url: song.audio_url || `http://localhost:5000/api/songs/${song.file_path}`
          }));
          setSongs(songsWithAudioUrl);
          console.log(response.songs.length)
          // Set playlist name from the first song or use a default
          if (response.songs.length > 0) {
            setPlaylistName(response.songs[0].playlist_name || 'My Playlist');
          } else {
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

  const handlePlaySong = async (song) => {
    try {
      // Stop any currently playing song
      if (currentlyPlaying && currentlyPlaying.song_id !== song.song_id) {
        setCurrentlyPlaying(null);
      }

      // Set the new song as currently playing
      setCurrentlyPlaying(song);

      // Record play history
      if (user && user.user_id) {
        try {
          await songService.addToPlayHistory(user.user_id, song.song_id);
          console.log('Play history recorded for song:', song.title);
        } catch (historyError) {
          console.error('Failed to record play history:', historyError);
        }
      }
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const handleStopPlaying = () => {
    setCurrentlyPlaying(null);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

      {/* Global Audio Player */}
      {currentlyPlaying && (
        <div className="global-audio-player">
          <div className="now-playing">
            <span>Now Playing: </span>
            <strong>{currentlyPlaying.title}</strong> by {currentlyPlaying.artistname}
          </div>
          <AudioPlayer 
            song={currentlyPlaying} 
            onStop={handleStopPlaying}
          />
        </div>
      )}

      <div className="songs-list">
        {songs.map((song, index) => (
          <div key={song.song_id} className="song-item">
            <div className="song-info">
              <span className="song-number">{index + 1}</span>
              <div className="song-details">
                <h4 className="song-title">
                  {song.title}
                  {currentlyPlaying?.song_id === song.song_id && (
                    <span className="playing-indicator"> 🔊 Playing</span>
                  )}
                </h4>
                <p className="song-artist">{song.artistname}</p>
              </div>
            </div>
            <div className="song-actions">
              <span className="song-duration">{formatDuration(song.duration)}</span>
              {currentlyPlaying?.song_id === song.song_id ? (
                <button 
                  onClick={handleStopPlaying}
                  className="stop-btn"
                  title="Stop playing"
                >
                  ⏹️ Stop
                </button>
              ) : (
                <button 
                  onClick={() => handlePlaySong(song)}
                  className="play-btn"
                  disabled={currentlyPlaying !== null}
                >
                  ▶ Play
                </button>
              )}
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