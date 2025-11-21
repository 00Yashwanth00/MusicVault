import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { songService } from '../../services/songService';
import AudioPlayer from '../common/AudioPlayer'; // Import the AudioPlayer
import '../../styles/Search.css';

const SearchSongs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Track which song is playing
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);
    setCurrentlyPlaying(null); // Reset currently playing when new search

    try {
      const result = await songService.searchSongs(searchTerm.trim());
      
      if (result.success) {
        // Add audio_url to each song if not already present
        const songsWithAudioUrl = result.songs.map(song => ({
          ...song,
          audio_url: song.audio_url || `http://localhost:5000/api/songs/${song.file_path}`
        }));
        setSearchResults(songsWithAudioUrl || []);
        if (result.songs.length === 0) {
          setError('No songs found matching your search');
        }
      } else {
        setError(result.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      setError(error.message);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError('');
    setHasSearched(false);
    setCurrentlyPlaying(null);
  };

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
          // Don't show this error to user as it shouldn't interrupt playback
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

  const handleBack = () => {
    navigate('/user/dashboard');
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Search Songs</h1>
        <p>Find your favorite tracks by title</p>
      </div>

      {/* Global Audio Player - Fixed at top when a song is playing */}
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

      <div className="search-content">
        {/* Search Form */}
        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter song title to search..."
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !searchTerm.trim()}
                className="search-btn"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleClearSearch}
                className="clear-btn"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`message ${searchResults.length === 0 ? 'error' : 'warning'}`}>
            {error}
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <div className="search-results">
            <div className="results-header">
              <h2>
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} song${searchResults.length !== 1 ? 's' : ''}`
                  : 'No Results'
                }
              </h2>
              {searchResults.length > 0 && (
                <span className="results-count">{searchResults.length} items</span>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="songs-list">
                {searchResults.map((song) => (
                  <div key={song.song_id} className="song-card">
                    <div className="song-info">
                      <h3 className="song-title">
                        {song.title}
                        {currentlyPlaying?.song_id === song.song_id && (
                          <span className="playing-indicator"> 🔊 Playing</span>
                        )}
                      </h3>
                      <p className="song-artist">{song.artistname}</p>
                      <div className="song-meta">
                        <span className="song-duration">
                          {formatDuration(song.duration)}
                        </span>
                        {song.genre && (
                          <span className="song-genre">{song.genre}</span>
                        )}
                      </div>
                    </div>
                    <div className="song-actions">
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
                          title="Play song"
                          disabled={currentlyPlaying !== null}
                        >
                          ▶ Play
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && !error && (
              <div className="no-results">
                <div className="no-results-icon">🎵</div>
                <h3>No songs found</h3>
                <p>Try different keywords or check the spelling</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Searching for songs...</p>
          </div>
        )}

        {/* Initial State - Before Search */}
        {!hasSearched && !loading && (
          <div className="initial-state">
            <div className="search-tips">
              <h3>Search Tips</h3>
              <ul>
                <li>Search by song title</li>
                <li>Try partial titles (e.g., "love" for "Love Story")</li>
                <li>Search is case-insensitive</li>
                <li>You can search by any word in the title</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSongs;